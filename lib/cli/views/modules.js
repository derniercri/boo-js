'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Info = require('./../../sdk/Info');

var renderModule = function renderModule(info) {
  return info.name;
};

var renderModules = function renderModules(infos) {
  var data = '';
  infos.map(function (item) {
    return data += renderModule(item);
  });

  return data;
};

exports.default = renderModules;