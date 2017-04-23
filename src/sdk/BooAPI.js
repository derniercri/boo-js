// @flow

import Info from './Info';
import { Component, parseComponents, parseComponent } from './Component';
import { parseInfos, parseInfo } from './Info';
import { Scene, parseScenes, parseScene } from './Scene';

const headers = {
  'Content-Type': 'application/json'
}

export default class BooAPI {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  getModules(): Array<Info> {
    let modules = [];

    return modules;
  }

  getComponents(): Promise<Array<Component>> {
    return fetch(this.url + '/api/v1/components')
      .then((res) => {
        return res.text();
      }).then((body) => {
        return parseComponents(JSON.parse(body));
      });
  }

  setValues(id: string, values: {}): Promise<Component> {
    return fetch(this.url + '/api/v1/components/' + id,
      { method: 'PUT', headers: headers, body: JSON.stringify({ values: values }) }
    ).then((res) => {
      return res.text();
    }).then((body) => {
      return parseComponent(JSON.parse(body));
    });
  }

  fetchModules() {
    return fetch(this.url + '/api/v1/modules')
      .then((res) => {
        return res.text();
      }).then((body) => {
        return parseInfos(JSON.parse(body));
      });
  }

  fetchScenes(): Promise<Array<Scene>> {
    return fetch(this.url + '/api/v1/scenes')
      .then((res) => {
        return res.text();
      }).then((body) => {
        return parseScenes(JSON.parse(body));
      });
  }

  saveScene(scene: Scene): Promise<Scene> {
    const method = scene.id ? 'PUT' : 'POST';
    const url = this.url + '/api/v1/scenes' + scene.id ? `/${scene.id}` : '';
    return fetch(url,
      { method: method, headers: headers, body: JSON.stringify(scene) })
      .then((res) => {
        return res.text();
      }).then((body) => {
        return parseScene(JSON.parse(body));
      })
  }

  saveModule(module: Info): Promise<Info> {
    return fetch(this.url + '/api/v1/modules/' + module.id,
      { method: 'PUT', headers: headers, body: JSON.stringify(module) })
      .then((res) => {
        return res.text();
      }).then((body) => {
        return parseInfo(JSON.parse(body));
      })
  }

  launch(id: string) {
    return fetch(this.url + '/api/v1/scenes/' + id + '/launch',
      { method: 'POST', headers: headers, body: JSON.stringify({}) });
  }
}
