// @flow

import {
  Info,
  Sdk,
  Component,
  Configuration,
  ConfigurationField,
  Temperature
} from './../../../sdk';
import NestStreamingClient from './NestStreamingClient';

export default class Nest {
  getId(): string {
    return '7277de4a-2200-4891-aedd-fbf622c18039';
  }

  getInfo(): Info {
    return new Info(
      this.getId(),
      "Nest",
      "Nest module using streaming API",
      new Configuration(
        [
          new ConfigurationField('token', '', 'string', 'Token'),
          new ConfigurationField('clientId', '', 'string', 'Client ID'),
          new ConfigurationField('clientSecret', '', 'string', 'Client secret'),
          new ConfigurationField('redirectUri', '', 'url', 'Redirect URI'),
          new ConfigurationField('tokenUrl', '', 'url', 'Token URL'),
        ]
      ),
    )
  }

  onStart(sdk: Sdk, config: Configuration) {
    let tokenField = config.fields.find((field) => {
      return field.name == 'token';
    });

    if (tokenField != null) {
      let client = new NestStreamingClient(tokenField.value, sdk);
      client.stream((devices) => {
        for (var i in devices.thermostats) {
          let device = devices.thermostats[i];
          sdk.addComponent(new Temperature(device.device_id, device.name));
        }
      })
    } else {
      sdk.notifyConfigurationError('token config not found');
    }
  }

  onComponentChange(component: Component) {

  }

  onConfigurationUpdate(configuration: Configuration): void {

  }

  onStop() {

  }
}


