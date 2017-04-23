// @flow

import { Component } from './../../../sdk/Component';
import Manager from './Manager';
import fs from 'fs';
import uuidV4 from 'uuid/v4';

export default class ComponentManager extends Manager<Component> {
  addOrUpdate(component: Component): void {
    let i = this.collection.findIndex((item) => {
      return item.identifier == component.identifier && item.moduleId == component.moduleId;
    })

    if (i == -1) {
      component.id = uuidV4();
      this.collection.push(component);
    } else {
      if (JSON.stringify(this.collection[i].values) !== JSON.stringify(component.values)) {
        for (let key in component.values) {
          this.collection[i].values[key] = component.values[key];
        }
      }
    }
  }

  getAllByType(type: string): Array<Component> {
    return this.collection.filter((item) => { return item.type == type; })
  }
}
