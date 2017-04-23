// @flow

import { Identifiable } from './../../../sdk/Identifiable';
import fs from 'fs';

export default class Manager<T: Identifiable> {
  filePath: string;
  collection: Array<T>;
  parseFunc: ?(Array<Object>) => Array<T>;

constructor(path: string, parseFunc: ?(Array<Object>) => Array<T>) {
  this.filePath = path;
  this.collection = [];
  this.parseFunc = parseFunc;
}

  addOrUpdate(item: T): void {
    let i = this.findIndex(item);
    if(i == -1) {
      this.collection.push(item)
    }else{
      if(JSON.stringify(this.collection[i]) !== JSON.stringify(item)) {
        // The Item is updated only if it has changed
        this.collection[i] = item;
      }
    }
  }

  findIndex(item: T): number {
    return this.collection.findIndex((element) => {
      return item.getId() == element.getId()
    });
  }

  get(id: string): ?T {
    return this.collection.find((item) => { return item.getId() == id });
  }

  delete(id: string): boolean {
    const i = this.collection.findIndex((element) => {
      return id == element.getId()
    });

    if (i === -1) { return false }
    this.collection.splice(i, 1)
    return true;
  }

  getAll(): Array<T> {
    return this.collection;
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.collection, null, 4));
  }

  read() {
    try {
      let data = fs.readFileSync(this.filePath);
      let func = this.parseFunc;
      if(func != null) {
        this.collection = func(JSON.parse(data.toString()));
      }
    } catch(e) {
      this.save(); // The file do not exists, so we create it
    }
  }
}
