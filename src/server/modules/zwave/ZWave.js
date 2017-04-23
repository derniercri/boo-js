// @flow

import { Component, Cover } from './../../../sdk/Component';
import { Configuration, ConfigurationField } from './../../../sdk/Configuration';
import Info from './../../../sdk/Info';
import Sdk from './../../../sdk/Sdk';
import OZW from 'openzwave-shared';

export default class ZWave {
  config: Configuration;
  device: string;
  zwave: OZW;
  values: {};
  sdk: Sdk;

  getId(): string {
    return 'a8c2e3da-5857-46a4-a5c7-1396e9ab2ecc';
  }

  getInfo(): Info {
    return new Info(
      this.getId(),
      'Zwave',
      'ZWave support',
      new Configuration(
        [
          new ConfigurationField('device', '', 'usb', 'USB dongle'),
        ]
      ),
    )
  }

  onStart(sdk: Sdk, config: Configuration) {
    let deviceField = config.get('device');
    this.values = {};
    let self = this;
    this.sdk = sdk;

    if (deviceField != null) {
      this.device = deviceField.value;
      this.zwave = new OZW({
        Logging: false,		// disable file logging (OZWLog.txt)
        ConsoleOutput: true // enable console logging
      });

      this.zwave.connect(this.device);

      this.zwave.on('driver ready', (homeid) => {
        sdk.debug('Driver ready');
      })

      this.zwave.on('driver failed', () => {
        sdk.error('Failed to start');
      })

      this.zwave.on('value added', (nodeid, commandclass, valueId) => {
        let device = self.values[nodeid];

        if (device == null) {
          device = {};
        }

        //  Dimmer update value
        if (commandclass == 38 && valueId.instance == 1 && valueId.index == 0) {
          //console.log(nodeid + ' ' +commandclass + ' ' + JSON.stringify(valueId));
          device.position = valueId.value == 0 ? 0 : (valueId.value / 255);
        }

        this.values[nodeid] = device;
      })

      this.zwave.on('node ready', (nodeid, nodeinfo) => {
        let device: ?Component;
        let values = self.values[nodeid];

        sdk.debug(nodeinfo);

        switch (nodeinfo.producttype) {
          case '0x0302':
            device = new Cover(nodeid, nodeinfo.product);
            break;
          default:
            sdk.debug('unsupported device ' + nodeinfo.producttype);
        }

        if (device) {
          if (values) { device.values = values; }
          sdk.addComponent(device);
        }
      })
    }
  }

  onComponentChange(component: Component) {
    let nodeid = component.identifier;
    this.sdk.logger.debug(component);
    if (component instanceof Cover) {
      try {
        this.zwave.setValue(nodeid, 38, 1, 0, component.values.position * 100);
      }catch(e) {
        this.sdk.logger.debug(e);
      }
    }
  }

  onConfigurationUpdate(configuration: Configuration) {
    this.config = configuration;
  }

  onStop() {
    this.zwave.connect(this.device);
  }

}
