// @flow

import Moment from 'moment';

export const LIGHT_TYPE = 'LIGHT';
export const COLOR_LIGHT_TYPE = 'COLOR_LIGHT';
export const TEMPERATURE_TYPE = 'TEMPERATURE';
export const WEATHER_TYPE = 'WEATHER';
export const COVER_TYPE = 'COVER';

export type ValuesType = {
  on: ?boolean,
  brightness: ?number,
  saturation: ?number,
  red: ?number,
  blue: ?number,
  green: ?number
};

export class Component {
  id: string;
  identifier: string;
  moduleId: string;
  label: string;
  type: string;
  values: Object;

  constructor(identifier: string, label: string) {
    this.identifier = identifier;
    this.label = label;
    this.moduleId = '';
    this.type = '';
    this.values = Object;
  }

  getId(): string {
    return this.id;
  }
}

export class ColorLight extends Component {
  constructor(identifier: string, label: string) {
    super(identifier, label);
    this.type = COLOR_LIGHT_TYPE;
    this.values = {
      on: null,
      brightness: null,
      saturation: null,
      red: null,
      blue: null,
      green: null,
    };
  }

  setOn(val: boolean) {
    this.values.on = val;
  }

  setBrightness(val: number) {
    this.values.brightness = val;
  }

  setSaturation(val: number) {
    this.values.saturation = val;
  }

  setRGB(r: number, g: number, b: number) {
    this.values.red = r;
    this.values.green = g;
    this.values.blue = b;
  }
}

export class Light extends Component {
  constructor(identifier: string, label: string) {
    super(identifier, label);
    this.type = LIGHT_TYPE;
    this.values = {
      on: null,
      brightness: null,
    };
  }

  setOn(val: boolean) {
    this.values.on = val;
  }

  setBrightness(val: number) {
    this.values.brightness = val;
  }
}

export class Temperature extends Component {
  constructor(identifier: string, label: string) {
    super(identifier, label);
    this.type = TEMPERATURE_TYPE;
    this.values = {
    };
  }
}

export class Weather extends Component {
  constructor(identifier: string, label: string) {
    super(identifier, label);
    this.type = WEATHER_TYPE;
    this.values = {
      sunset: null,
      sunrise: null,
      temp: null,
      code: null,
      text: null,
    };
  }

  set(sunset: Moment, sunrise: Moment, temp: number, code: number, text: string) {
    this.values = {
      sunset: sunset,
      sunrise: sunrise,
      temp: temp,
      code: code,
      text: text,
    };
  }
}

export class Cover extends Component {
  constructor(identifier: string, label: string) {
    super(identifier, label);
    this.type = COVER_TYPE;
    this.values = {
      position: 0.0,
    };
  }
}

export function parseComponents(data: Array<Object>): Array<Component> {
  return data.map((item) => { return parseComponent(item); })
}

export function parseComponent(data: Object): Component {
  let component: Component;

  switch (data.type) {
    case LIGHT_TYPE:
      component = new Light(data.identifier, data.label);
      break;
    case COLOR_LIGHT_TYPE:
      component = new ColorLight(data.identifier, data.label);
      break;
    case TEMPERATURE_TYPE:
      component = new Temperature(data.identifier, data.label);
      break;
    case WEATHER_TYPE:
      component = new Weather(data.identifier, data.label);
      break;
    case COVER_TYPE:
      component = new Cover(data.identifier, data.label);
      break;
    default:
      throw 'unknow component ' + data.type;
  }

  component.moduleId = data.moduleId;
  component.values = data.values;
  component.id = data.id;

  return component;
}

