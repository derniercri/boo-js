'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('./../../sdk');

var _ModuleManager = require('./memory/ModuleManager');

var _ModuleManager2 = _interopRequireDefault(_ModuleManager);

var _ComponentManager = require('./memory/ComponentManager');

var _ComponentManager2 = _interopRequireDefault(_ComponentManager);

var _ConfigurationManager = require('./memory/ConfigurationManager');

var _ConfigurationManager2 = _interopRequireDefault(_ConfigurationManager);

var _SceneManager = require('./memory/SceneManager');

var _SceneManager2 = _interopRequireDefault(_SceneManager);

var _GroupManager = require('./memory/GroupManager');

var _GroupManager2 = _interopRequireDefault(_GroupManager);

var _EventManager = require('./EventManager');

var _EventManager2 = _interopRequireDefault(_EventManager);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Brain = function () {
  function Brain(logger) {
    var _this = this;

    _classCallCheck(this, Brain);

    this.moduleManager = new _ModuleManager2.default('./config/modules.json', null);
    this.componentManager = new _ComponentManager2.default('./config/components.json', _sdk.parseComponents);
    this.configurationManager = new _ConfigurationManager2.default('./config/configuration.json'); //TODO: change parse function
    this.sceneManager = new _SceneManager2.default('./config/scenes.json', _sdk.parseScenes);
    this.groupManager = new _GroupManager2.default('./config/groups.json', _sdk.parseGroups);
    this.eventManager = new _EventManager2.default(this.componentManager, logger);
    this.logger = logger;
    this.subscribers = [];

    this.configurationManager.read();
    this.componentManager.read();
    this.sceneManager.read();

    var self = this;

    setTimeout(function () {
      setInterval(function () {
        var event = new _sdk.TimeChangeEvent(new _moment2.default());
        var scenes = self.eventManager.handle(event, self.sceneManager.getAll());
        if (scenes.length > 0) {
          _this.logger.debug('launching scenes ' + JSON.stringify(scenes));
        }
        scenes.map(function (scene) {
          _this.startScene(scene);
        });
      }, 1000);
    }, 60000);
  }

  _createClass(Brain, [{
    key: 'startScene',
    value: function startScene(scene) {
      var self = this;
      scene.sequence.map(function (action) {
        if (action instanceof _sdk.StateChangeAction) {
          var component = self.componentManager.get(action.componentId);
          if (component) {
            component.values[action.name] = action.value;
            self.updateComponent(component);
          }
        }
      });
    }
  }, {
    key: 'registerModule',
    value: function registerModule(module) {
      this.moduleManager.addOrUpdate(module);
    }
  }, {
    key: 'getModules',
    value: function getModules() {
      var self = this;
      return this.moduleManager.getAllInfo().map(function (item) {
        item.enabled = self.configurationManager.isEnabled(item.id);
        item.configuration = self.configurationManager.generateConfiguration(item.id, item.configuration);
        return item;
      });
    }
  }, {
    key: 'getModule',
    value: function getModule(id) {
      var module = this.moduleManager.get(id);

      if (module == null) {
        return null;
      }
      var item = module.getInfo();
      item.enabled = this.configurationManager.isEnabled(item.id);
      item.configuration = this.configurationManager.generateConfiguration(item.id, item.configuration);

      return item;
    }
  }, {
    key: 'getScenes',
    value: function getScenes() {
      return this.sceneManager.getAll();
    }
  }, {
    key: 'saveScene',
    value: function saveScene(scene) {
      this.sceneManager.addOrUpdate(scene);
      this.sceneManager.save();
    }
  }, {
    key: 'deleteScene',
    value: function deleteScene(id) {
      var exist = this.sceneManager.delete(id);
      this.sceneManager.save();
      return exist;
    }
  }, {
    key: 'getServerId',
    value: function getServerId() {
      return this.configurationManager.serverId;
    }
  }, {
    key: 'getComponents',
    value: function getComponents() {
      return this.componentManager.getAll();
    }
  }, {
    key: 'getComponent',
    value: function getComponent(id) {
      return this.componentManager.get(id);
    }
  }, {
    key: 'updateComponent',
    value: function updateComponent(component) {
      var module = this.moduleManager.get(component.moduleId);

      if (module != null) {
        this.componentManager.addOrUpdate(component);
        this.componentManager.save();
        module.onComponentChange(component);
      } else {
        throw 'module not found';
      }
    }
  }, {
    key: 'setEnabled',
    value: function setEnabled(moduleId, enabled) {
      this.configurationManager.setEnabled(moduleId, enabled);
      this.configurationManager.save();

      if (enabled === true) {
        this.start(moduleId);
      }
    }
  }, {
    key: 'updateConfigurationFields',
    value: function updateConfigurationFields(moduleId, fields) {
      var _this2 = this;

      fields.map(function (field) {
        _this2.configurationManager.update(moduleId, field.name, field.value);
      });

      var module = this.moduleManager.get(moduleId);
      this.configurationManager.save();

      if (module != null) {
        var configuration = this.configurationManager.generateConfiguration(moduleId, module.getInfo().configuration);

        module.onConfigurationUpdate(configuration);
      } else {
        throw 'module not found';
      }
    }
  }, {
    key: 'onEvent',
    value: function onEvent(func) {
      this.subscribers.push(func);
    }
  }, {
    key: 'startAll',
    value: function startAll() {
      var self = this;
      this.moduleManager.getAll().map(function (module) {
        self.start(module.getInfo().id);
      });
    }
  }, {
    key: 'start',
    value: function start(moduleId) {
      var self = this;
      var module = self.moduleManager.get(moduleId);

      if (module != null) {
        var configUpdate = function configUpdate(moduleId, name, value) {
          self.configurationManager.update(moduleId, name, value);
          self.configurationManager.save();
        };

        var componentAdd = function componentAdd(component) {
          self.componentManager.addOrUpdate(component);
          self.componentManager.save();
        };

        if (self.configurationManager.isEnabled(module.getInfo().id)) {
          self.logger.info('Starting module ' + module.getInfo().name);
          var config = module.getInfo().configuration;
          self.configurationManager.add(module.getInfo().id, config);

          var updatedConfig = self.configurationManager.generateConfiguration(module.getInfo().id, config);

          // Force to save configuration fields
          updatedConfig.fields.map(function (field) {
            configUpdate(moduleId, field.name, field.value);
          });

          module.onStart(new _sdk.Sdk(this.logger, module.getInfo().id, configUpdate, componentAdd), updatedConfig);
        }
      }
    }
  }, {
    key: 'handleCommands',
    value: function handleCommands(commands) {
      var self = this;
      if (commands.length >= 3) {
        var action = actionFind(commands);

        if (action != null) {
          var laction = action;
          var type = typeFind(commands);
          console.log(type);

          if (type != null) {
            self.componentManager.getAll().map(function (component) {
              if ((component.type == _sdk.LIGHT_TYPE || component.type == _sdk.COLOR_LIGHT_TYPE) && type == _sdk.LIGHT_TYPE) {
                component.values[laction.name] = laction.value;
                self.updateComponent(component);
              }

              if (component.type == _sdk.COVER_TYPE && type == _sdk.COVER_TYPE && laction.name == 'on') {
                component.values['position'] = laction.value ? 0.9 : 0.0;
                self.updateComponent(component);
              }
            });
          }
        }
      }
    }
  }]);

  return Brain;
}();

exports.default = Brain;


function actionFind(commands) {
  if (commands[0] == 'allume' || commands[0] == 'ouvre') {
    return { name: 'on', value: true };
  } else if (commands[0] == 'éteins' || commands[0] == 'ferme') {
    return { name: 'on', value: false };
  }

  return null;
}

function typeFind(commands) {
  if (commands.find(function (element) {
    return element == 'lumières' || element == 'lumière' || element == 'lampe' || element == 'lampes';
  })) {
    return _sdk.LIGHT_TYPE;
  }

  if (commands.find(function (element) {
    return element == 'volet' || element == 'volets';
  })) {
    return _sdk.COVER_TYPE;
  }

  return null;
}