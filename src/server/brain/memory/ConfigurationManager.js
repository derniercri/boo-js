// @flow

import fs from 'fs';
import { Configuration } from './../../../sdk/Configuration';
import Info from './../../../sdk/Info';
import Manager from './Manager';
import uuidV4 from 'uuid/v4';

class ConfigurationItem {
  moduleId: string;
  name: string;
  value: any;

  constructor(moduleId: string, name: string, value: any) {
    this.moduleId = moduleId;
    this.name = name;
    this.value = value;
  }

  getId(): string {
    return this.moduleId + this.name;
  }
}

export default class ModuleManager {
  filePath: string;
  status: {};
  collection: Array<ConfigurationItem>;
  serverId: string;

  constructor(path: string) {
    this.filePath = path;
    this.status = {};
    this.serverId = uuidV4().split('-').join('');
    this.collection = [];
  }

  setEnabled(moduleId: string, enabled: boolean): void {
    this.status[moduleId] = enabled;
  }

  isEnabled(moduleId: string): boolean {
    return this.status[moduleId] === true ? true : false;
  }

  add(moduleId: string, config: Configuration): void {
    config.fields.map((field) => {
      if (this.get(moduleId, field.name) == null) {
        this.collection.push(new ConfigurationItem(moduleId, field.name, field.value));
      }
    })
  }

  update(moduleId: string, name: string, value: any): void {
    this.collection = this.collection.map((item) => {
      if (item.moduleId == moduleId && item.name == name) { item.value = value }
      return item;
    })
  }

  generateConfiguration(moduleId: string, config: Configuration): Configuration {
    let self = this;
    config.fields = config.fields.map((field) => {
      let item = self.get(moduleId, field.name);
      if (item != null) { field.value = item.value }
      return field;
    })

    return config;
  }

  get(moduleId: string, name: string): ?ConfigurationItem{
    return this.collection.find((item: ConfigurationItem) => {
      return item.moduleId == moduleId && item.name == name;
    })
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(
      {
        serverId: this.serverId,
        status: this.status,
        fields: this.collection
      },
      null,
      4
    ));
  }

  read() {
    try {
      let data = JSON.parse(fs.readFileSync(this.filePath).toString());
      this.collection = data.fields;
      this.status = data.status;
      this.serverId = data.serverId;
    } catch (e) {
      this.save();
    }
  }
}
