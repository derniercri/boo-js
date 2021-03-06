// @flow

import fs from 'fs';
import { Configuration, Info, User, parseUsers } from './../../../sdk';
import Manager from './Manager';

class ConfigurationItem {
  moduleId: string;
  name: string;
  value: string;

  constructor(moduleId: string, name: string, value: string) {
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
  users: Array<User>;

  constructor(path: string) {
    this.filePath = path;
    this.status = {};
    this.collection = [];
    this.users = [new User('admin', 'admin')];
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

  update(moduleId: string, name: string, value: string): void {
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
        fields: this.collection,
        users: this.users,
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
      this.users = parseUsers(data.users);
    } catch (e) {
      this.save();
    }
  }
}
