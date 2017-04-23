// @flow

import Info from './../../../sdk/Info';
import Sdk from './../../../sdk/Sdk';
import { Component, Light, ColorLight } from './../../../sdk/Component';
import { Configuration, ConfigurationField } from './../../../sdk/Configuration';
import hue, { HueApi } from 'node-hue-api';
import { createComponents } from './factory';

export default class Hue {
  api: HueApi;

  getId(): string {
    return "2d7c7893-f8de-41df-8cb3-61315826f2ff";
  }

  getInfo(): Info {
    return new Info(
      this.getId(),
      "Hue",
      "Philips HUE module",
      new Configuration(
        [
          new ConfigurationField('address', '', 'url', 'Address of the Hue controller'),
          new ConfigurationField('user', '', 'string', 'User registered on the Hue controller'),
        ]
      ),
    )
  }

  onStart(sdk: Sdk, config: Configuration) {
    let self = this;
    let address = config.get('address');
    let user = config.get('user');

    if (user != null && address != null) {
      if (user.value == null || address.value == null) {
        sdk.debug(`looking for Hue bridges`);
        this.find(sdk);
      } else {
        sdk.info(`connecting to ${user.value}:${address.value}`);
        try {
          this.api = new HueApi(address.value, user.value);
        } catch (e) {
          sdk.notifyConfigurationError('Unable to connect to ' + address.value);
        }
      }

      try {
        self.update(sdk);
      } catch (e) {
        sdk.error(e);
      }

    } else {
      sdk.error(`missing configuration fields`);
    }
  }

  onComponentChange(component: Component) {
    if (component instanceof Light) {
      this.api.setLightState(
        component.identifier,
        { 'on': component.values.on, 'bri': 255 * component.values.brightness }
      ).then((result) => { })
        .fail((error) => { })
        .done();
    } else if (component instanceof ColorLight) {
    }
  }

  update(sdk: Sdk) {
    let self = this;
    if (this.api != null) {
      this.api.getFullState().then((result) => {
        let components = createComponents(result);
        components.map((component) => {
          sdk.addComponent(component);
        })
      }).done(
        setTimeout(function () { self.update(sdk) }, 3000)
        );
    }
  }

  find(sdk: Sdk) {
    hue.nupnpSearch().then((bridges: Array<any>) => {
      bridges.map((bridge) => {
        let api = new HueApi();
        api.registerUser(bridge.ipaddress, '')
          .then((user) => {
            sdk.updateConfiguration('user', user);
            sdk.updateConfiguration('address', bridge.ipaddress);
            self.api = new HueApi(bridge.ipaddress, user);
          })
          .fail((error) => {
            sdk.notifyConfigurationError(error);
          })
          .done();
      })
    }).done();
  }

  onConfigurationUpdate(configuration: Configuration): void {

  }

  onStop() {

  }
}
