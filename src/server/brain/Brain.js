// @flow

import {
  ConfigurationField,
  Module,
  TimeChangeEvent,
  StateChangeAction,
  Scene,
  parseScenes,
  parseGroups,
  parseComponents,
  LIGHT_TYPE,
  COLOR_LIGHT_TYPE,
  COVER_TYPE,
  Info,
  Component,
  Sdk
} from './../../sdk';
import ModuleManager from './memory/ModuleManager';
import ComponentManager from './memory/ComponentManager';
import ConfigurationManager from './memory/ConfigurationManager';
import SceneManager from './memory/SceneManager';
import GroupManager from './memory/GroupManager';
import EventManager from './EventManager';
import winston from 'winston';
import Moment from 'moment';

export default class Brain {
  moduleManager: ModuleManager;
  componentManager: ComponentManager;
  configurationManager: ConfigurationManager;
  sceneManager: SceneManager;
  groupManager: GroupManager;
  subscribers: Array<() => void>;
  eventManager: EventManager;
  logger: winston;

  constructor(logger: winston) {
    this.moduleManager = new ModuleManager('./config/modules.json', null);
    this.componentManager = new ComponentManager('./config/components.json', parseComponents);
    this.configurationManager = new ConfigurationManager('./config/configuration.json'); //TODO: change parse function
    this.sceneManager = new SceneManager('./config/scenes.json', parseScenes);
    this.groupManager = new GroupManager('./config/groups.json', parseGroups);
    this.eventManager = new EventManager(this.componentManager, logger);
    this.logger = logger;
    this.subscribers = [];

    this.configurationManager.read();
    this.componentManager.read();
    this.sceneManager.read();

    let self = this;

    setTimeout(() => {
      setInterval(() => {
        const event = new TimeChangeEvent(new Moment());
        const scenes = self.eventManager.handle(event, self.sceneManager.getAll());
        if (scenes.length > 0) { this.logger.debug(`launching scenes ${JSON.stringify(scenes)}`);}
        scenes.map((scene) => { this.startScene(scene) });
      }, 1000)
    }, 60000)
  }

  startScene(scene: Scene) {
    const self = this;
    scene.sequence.map((action) => {
      if (action instanceof StateChangeAction ) {
        const component = self.componentManager.get(action.componentId);
        if (component) {
          component.values[action.name] = action.value;
          self.updateComponent(component);
        }
      }
    })
  }

  registerModule(module: Module): void {
    this.moduleManager.addOrUpdate(module);
  }

  getModules(): Array<Info> {
    let self = this;
    return this.moduleManager.getAllInfo().map((item) => {
      item.enabled = self.configurationManager.isEnabled(item.id);
      item.configuration = self.configurationManager.generateConfiguration(
        item.id,
        item.configuration
      )
      return item;
    });
  }

  getModule(id: string): ?Info {
    let module = this.moduleManager.get(id);

    if(module == null) { return null }
      let item = module.getInfo();
    item.enabled = this.configurationManager.isEnabled(item.id);
    item.configuration = this.configurationManager.generateConfiguration(
      item.id,
      item.configuration
    )

      return item
  }

  getScenes(): Array<Scene> {
    return this.sceneManager.getAll();
  }

  saveScene(scene: Scene) {
    this.sceneManager.addOrUpdate(scene);
    this.sceneManager.save();
  }

  deleteScene(id: string): boolean {
    const exist = this.sceneManager.delete(id);
    this.sceneManager.save();
    return exist;
  }

  getServerId(): string {
    return this.configurationManager.serverId;
  }

  getComponents(): Array<Component> {
    return this.componentManager.getAll();
  }

  getComponent(id: string): ?Component {
    return this.componentManager.get(id);
  }

  updateComponent(component: Component): void {
    let module = this.moduleManager.get(component.moduleId);

    if (module != null) {
      this.componentManager.addOrUpdate(component);
      this.componentManager.save();
      module.onComponentChange(component);
    } else {
      throw 'module not found';
    }
  }

  setEnabled(moduleId: string, enabled: boolean) {
    this.configurationManager.setEnabled(moduleId, enabled);
    this.configurationManager.save();

    if (enabled === true) {
      this.start(moduleId);
    }
  }

  updateConfigurationFields(moduleId: string, fields: Array<ConfigurationField>) {
    fields.map((field) => {
      this.configurationManager.update(moduleId, field.name, field.value)
    })

    let module = this.moduleManager.get(moduleId);
    this.configurationManager.save();

    if (module != null) {
      let configuration = this.configurationManager.generateConfiguration(
        moduleId,
        module.getInfo().configuration
      );

      module.onConfigurationUpdate(configuration);
    } else {
      throw 'module not found'
    }
  }

  onEvent(func: () => void) {
    this.subscribers.push(func)
  }

  startAll() {
    let self = this;
    this.moduleManager.getAll().map((module) => {
      self.start(module.getInfo().id)
    })
  }

  start(moduleId: string) {
    let self = this;
    let module = self.moduleManager.get(moduleId);

    if (module != null) {
      let configUpdate = (moduleId: string, name: string, value: string) => {
        self.configurationManager.update(moduleId, name, value);
        self.configurationManager.save();
      }

      let componentAdd = (component: Component) => {
        self.componentManager.addOrUpdate(component);
        self.componentManager.save();
      }

      if (self.configurationManager.isEnabled(module.getInfo().id)) {
        self.logger.info('Starting module ' + module.getInfo().name)
        let config = module.getInfo().configuration;
        self.configurationManager.add(module.getInfo().id, config);

        let updatedConfig = self.configurationManager.generateConfiguration(
          module.getInfo().id,
          config
        );

        // Force to save configuration fields
        updatedConfig.fields.map((field) => {
          configUpdate(moduleId, field.name, field.value);
        })

        module.onStart(
          new Sdk(
            this.logger,
            module.getInfo().id,
            configUpdate,
            componentAdd
          ),
          updatedConfig
        );
      }
    }
  }

  handleCommands(commands: Array<string>): void {
    const self = this;
    if (commands.length >= 3) {
      let action = actionFind(commands)

      if (action != null) {
        const laction = action;
        const type = typeFind(commands);
        if (type != null) {
          self.componentManager.getAll().map((component: Component) => {
            if ((component.type == LIGHT_TYPE || component.type == COLOR_LIGHT_TYPE) && type == LIGHT_TYPE) {
              component.values[laction.name] = laction.value;
              self.updateComponent(component);
            }

            if (component.type == COVER_TYPE && type == COVER_TYPE && laction.name == 'on') {
              component.values['position'] = laction.value ? 0.9 : 0.0;
              self.updateComponent(component);
            }
          })
        }
      }
    }
  }
}

function actionFind(commands: Array<string>): ?{name: string, value: number} {
  if (commands[0] == 'allume' || commands[0] == 'ouvre')  {
    return {name: 'on', value: 1};
  } else if(commands[0] == 'éteins' || commands[0] == 'ferme' ) {
    return {name: 'on', value: 0};
  }

  return null;
}

function typeFind(commands: Array<string>): ?string {
  if (commands.find((element) => {
    return element == 'lumières' ||
        element == 'lumière' ||
        element ==  'lampe' ||
        element ==  'lampes'
  })) { return LIGHT_TYPE }

  if (commands.find((element) => {
    return element == 'volet' ||
        element == 'volets'
  })) { return COVER_TYPE }

  return null;
}
