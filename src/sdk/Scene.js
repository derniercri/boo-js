// @flow

import uuidV4 from 'uuid/v4';

export const ACTION_STATE_CHANGE = 'STATE';
export const TRIGGER_SUNRISE = 'SUNRISE';
export const TRIGGER_SUNSET = 'SUNSET';

export class Action {
  type: string;
}


export class Trigger {
  type: string;
}

export class StateChangeAction extends Action {
  value: number;
  name: string;
  componentId: string;

  constructor(componentId: string, name: string, value: number) {
    super();
    this.type = ACTION_STATE_CHANGE;
    this.componentId = componentId;
    this.name = name;
    this.value = value;
  }
}

export class Scene {
  id: string;
  name: string;
  description: string;
  triggers: Array<Trigger>;
  sequence: Array<Action>;

  constructor() {
    this.id = uuidV4();
  }

  getId(): string {
    return this.id;
  }
}

export function parseScenes(data: Array<Scene>): Array<Scene> {
  return data.map((item) => { return parseScene(item) });
}

export function parseScene(data: Scene): Scene {
  const scene = new Scene();
  if (data.id) { scene.id = data.id; }
  scene.description = data.description;
  scene.name = data.name;
  scene.sequence = parseActions(data.sequence);
  scene.triggers = parseTriggers(data.triggers);

  return scene;
}

function parseActions(data: Array<Action>): Array<Action> {
  return data.map((item) => { return parseAction(item) })
}

function parseAction(data: Object): Action {
  let action: Action;

  switch (data.type) {
    case ACTION_STATE_CHANGE:
      action = new StateChangeAction(data.componentId, data.name, data.value);
      break;
    default:
      throw 'unknow action ' + data.type;
  }

  return action;
}


function parseTriggers(data: Array<Trigger>): Array<Trigger> {
  return data.map((item) => { return parseTrigger(item) })
}

function parseTrigger(data: Trigger): Trigger {
  const trigger = new Trigger();
  trigger.type = data.type;

  return trigger;
}
