// @flow

import Event, { TimeChangeEvent, TIME_CHANGE } from './../../sdk/Event';
import { Scene } from './../../sdk/Scene';
import { Component, WEATHER_TYPE, Weather } from './../../sdk/Component';
import ComponentManager from './memory/ComponentManager';
import { TRIGGER_SUNRISE, TRIGGER_SUNSET } from './../../sdk/Scene';
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
        if (self.updateState(SUNSET, event.time.diff(moment(item.values.sunset)) > 0)) {
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
