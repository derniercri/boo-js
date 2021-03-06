// @flow

import { Module, Info } from './../../../sdk';
import Manager from './Manager';

export default class ModuleManager extends Manager<Module> {
  getAllInfo(): Array<Info> {
    return this.collection.map((item: Module) => {
      return item.getInfo();
    });
  }
}
