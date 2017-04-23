// @flow

import Info from './../sdk/Info';
import Sdk from './Sdk';
import { Component } from './Component';
import { Configuration } from './Configuration';

export interface Module {
  getId(): string,
  getInfo(): Info,
  onStart(sdk: Sdk, config: Configuration): void,
  onStop(): void,
  onComponentChange(component: Component): void,
  onConfigurationUpdate(configuration: Configuration): void
}
