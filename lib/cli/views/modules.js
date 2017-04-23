'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Info = require('./../../sdk/Info');

var _Info2 = _interopRequireDefault(_Info);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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