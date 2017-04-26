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
  value: any;
  name: string;
  componentId: string;

  constructor(componentId: string, name: string, value: any) {
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

export function parseScenes(data: Array<Object>): Array<Scene> {
  return data.map((item) => { return parseScene(item) });
}

export function parseScene(data: Object): Scene {
  const scene = new Scene();
  if (data.id) { scene.id = data.id; }
  scene.description = data.description;
  scene.name = data.name;
  scene.sequence = parseActions(data.sequence);
  scene.triggers = parseTriggers(data.triggers);

  return scene;
}

function parseActions(data: Array<Object>): Array<Action> {
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


function parseTriggers(data: Array<Object>): Array<Trigger> {
  return data.map((item) => { return parseTrigger(item) })
}

function parseTrigger(data: Object): Trigger {
  const trigger = new Trigger();
  trigger.type = data.type;

  return trigger;
}
