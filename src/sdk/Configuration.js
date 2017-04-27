// @flow

export class ConfigurationField {
  name: string;
  value: ?string;
  defaultValue: ?string;
  type: string;
  description: string;

  constructor(name: string, defaultValue: ?string, type: string, description: string) {
    this.name = name;
    this.defaultValue = defaultValue;
    this.type = type;
    this.description = description;
    this.value = null;
  }
}

export class Configuration {
  fields: Array<ConfigurationField>;

  constructor(fields: Array<ConfigurationField>) {
    this.fields = fields;
  }

  get(name: string): ?ConfigurationField {
    return this.fields.find((field) => { return field.name == name });
  }
}


export function parseConfiguration(data: Configuration): Configuration {
  if (data.fields instanceof Array ) {
    return new Configuration(data.fields.map((item) => {
      const field = new ConfigurationField(
        item.name,
        item.defaultValue,
        item.type,
        item.description
      )
      field.value = item.value;
      return field;
    }))
  } else {
    throw 'parse configuration error';
  }
}
