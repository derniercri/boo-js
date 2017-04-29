// @flow

export class User {
  name: string
  password: string

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
}


export function parseUsers(data: Array<Object>): Array<User> {
  return data.map((item) => { return parseUser(item) })
}

export function parseUser(data: Object): User {
  return new User(data.name, data.password);
}
