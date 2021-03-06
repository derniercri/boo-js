// @flow

import { Configuration, parseConfiguration } from './Configuration';

export class Info {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  configuration: Configuration;

  constructor(id: string, name: string, description: string, configuration: Configuration) {
    this.id = id;
    this.name = name;
    this.enabled = true;
    this.description = description;
    this.configuration = configuration;
  }
}

export function parseInfos(data: Array<Info>): Array<Info> {
  return data.map(item => parseInfo(item))
}

export function parseInfo(data: Info): Info {
  const info = new Info(
    data.id,
    data.name,
    data.description,
    parseConfiguration(data.configuration),
  )
  info.enabled = data.enabled;
  return info;
}
