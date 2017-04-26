// @flow

import { Info } from './../../sdk/Info';

const renderModule = (info: Info): string => {
  return info.name;
}

const renderModules = (infos: Array<Info>): string => {
  let data = ''
  infos.map((item) => (
    data += renderModule(item))
  );

  return data;
}

export default renderModules
