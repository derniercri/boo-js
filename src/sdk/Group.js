// @flow

export class Group {
  id: string;
  name: string;
  description: string;
  components: Array<string>;
  getId(): string { return this.id }
}

export function parseGroups(data: Array<Group>): Array<Group> {
  return data.map((item) => { return parseGroup(item) })
}

export function parseGroup(data: Group): Group {
  let group = new Group();
  return group;
}
