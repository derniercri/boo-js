// @flow

import { Component } from './Component';
import Winston from 'winston';

export class Sdk {
  moduleId: string;
  logger: Winston;
  configUpdateCb: (moduleId: string, name: string, value: string) => void;
  addComponentCb: (component: Component) => void;

  constructor(
    logger: Winston,
    pluginId: string,
    configUpdateCb: (moduleId: string, name: string, value: string) => void,
    addComponentCb: (component: Component) => void
  ) {
    this.logger = logger;
    this.moduleId = pluginId;
    this.configUpdateCb = configUpdateCb;
    this.addComponentCb = addComponentCb;
  }

  addComponent(component: Component) {
    component.moduleId = this.moduleId;
    this.addComponentCb(component);
  }

  updateConfiguration(name: string, value: string) {
    this.info(`Updating configuration ${name} to ${value}`);
    this.configUpdateCb(this.moduleId, name, value);
  }

  notifyConfigurationError(message: string) {
    this.warn(message);
  }

  error(message: string) {
    this.log('error', message);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  info(message: string) {
    this.log('info', message);
  }

  debug(message: string) {
    this.log('debug', message);
  }

  log(level: string, message: string) {
    this.logger.log(level, { pluginId: this.moduleId, message: message });
  }
}
