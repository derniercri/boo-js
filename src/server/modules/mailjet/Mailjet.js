// @flow

import Info from './../../../sdk/Info';
import Sdk from './../../../sdk/Sdk';
import { Component } from './../../../sdk/Component';
import { Configuration, ConfigurationField } from './../../../sdk/Configuration';
import MailjetSDK from 'node-mailjet';

export default class Mailjet {
  getId(): string {
    return '76c5429d-acdc-42ac-8d06-e6a5e09a9aad';
  }

  getInfo(): Info {
    return new Info(
      this.getId(),
      "Mailjet",
      "Send emails with Mailjet",
      new Configuration(
        [
          new ConfigurationField('secret', '', 'string', 'Mailjet secret'),
          new ConfigurationField('key', '', 'string', 'Mailjet API key'),
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


