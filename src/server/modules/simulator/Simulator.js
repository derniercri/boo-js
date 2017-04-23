// @flow

import Info from './../../../sdk/Info';
import Sdk from './../../../sdk/Sdk';
import { Component } from './../../../sdk/Component';
import { Configuration, ConfigurationField } from './../../../sdk/Configuration';

export default class Simulator {
  getId(): string {
    return "8ded3b37-7bb1-49c2-871e-48c6b6238b7e";
  }

  getInfo(): Info {
    return new Info(
      this.getId(),
      "Simulator",
      "Component simulator",
      new Configuration(
        [
          new ConfigurationField("auto", true, "boolean", "Auto genrate values"),
          new ConfigurationField("delay", 20, "integer", "Delay beetween generated values"),
        ]
      ),
    )
  }

  onStart(sdk: Sdk, config: Configuration) {
  }

  onComponentChange(component: Component) {
  }

  onConfigurationUpdate(configuration: Configuration): void {
  }

  onStop() {

  }
}
