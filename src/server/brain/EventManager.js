// @flow

import {
  Event,
  TimeChangeEvent,
  Scene,
  Component,
  Weather,
  TRIGGER_SUNRISE,
  WEATHER_TYPE,
  TRIGGER_SUNSET,
  TIME_CHANGE
} from './../../sdk';
import ComponentManager from './memory/ComponentManager';
import winston from 'winston';
import moment from 'moment';

const SUNSET = 'sunset';

export default class EventManager {
  componentManager: ComponentManager;
  logger: winston;
  state: {
    sunset: null
  };

  constructor(componentManager: ComponentManager, logger: winston) {
    this.componentManager = componentManager;
    this.logger = logger;
    this.state = {
      sunset: null
    };
  }

  handle(event: Event, scenes: Array<Scene>): Array<Scene> {
    let self = this;

    if (event instanceof TimeChangeEvent) {
      return self.handleTimeChange(event, scenes)
    }else{
      throw 'unknow event type ' + event.type;
    }
  }

  handleTimeChange(event: TimeChangeEvent, scenes: Array<Scene>): Array<Scene> {
    let self = this;
    let validScenes = [];

    this.componentManager.getAllByType(WEATHER_TYPE).map((item) => {
      if (item.values.sunset != null && item.values.sunrise != null) {
        if (self.updateState(SUNSET, !(getTime(event.time) > getTime(moment(item.values.sunrise))  && getTime(event.time) < getTime(moment(item.values.sunset))) )) {
          // Find SUNSET or SUNRISE events
          const lookup = this.state.sunset == true ?
            TRIGGER_SUNSET :
            TRIGGER_SUNRISE;

          this.logger.debug(`lookup for ${lookup}`);
          validScenes = scenes.filter((item) => {
            return item.triggers.find((trigger) => {
              self.logger.debug(`${trigger.type} === ${lookup}`)
              return trigger.type === lookup
            })
          })
        }
      }
    })

    return validScenes;
  }

  updateState(key: string, value: any): boolean {
    if (this.state[key] != value) {
      this.state[key] = value;
      this.logger.debug(`switched ${key} to ${value}`);
      return true;
    }

    return false;
  }

  getState(key: string): any {
    return this.state[key];
  }
}

export function getTime(time: moment): number {
  return 60 * 60 * time.hours() + 60 * time.minutes() + time.seconds()
}
