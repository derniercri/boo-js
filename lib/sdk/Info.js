'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Info = undefined;
exports.parseInfos = parseInfos;
exports.parseInfo = parseInfo;

var _Configuration = require('./Configuration');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Info = exports.Info = function Info(id, name, description, configuration) {
  _classCallCheck(this, Info);

  this.id = id;
  this.name = name;
  this.enabled = true;
  this.description = description;
  this.configuration = configuration;
};

function parseInfos(data) {
  return data.map(function (item) {
    return parseInfo(item);
  });
}

function parseInfo(data) {
  var info = new Info(data.id, data.name, data.description, (0, _Configuration.parseConfiguration)(data.configuration));
  info.enabled = data.enabled;
  return info;
}