'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.parseConfiguration = parseConfiguration;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigurationField = exports.ConfigurationField = function ConfigurationField(name, defaultValue, type, description) {
  _classCallCheck(this, ConfigurationField);

  this.name = name;
  this.defaultValue = defaultValue;
  this.type = type;
  this.description = description;
  this.value = null;
};

var Configuration = exports.Configuration = function () {
  function Configuration(fields) {
    _classCallCheck(this, Configuration);

    this.fields = fields;
  }

  _createClass(Configuration, [{
    key: 'get',
    value: function get(name) {
      return this.fields.find(function (field) {
        return field.name == name;
      });
    }
  }]);

  return Configuration;
}();

function parseConfiguration(data) {
  if (data.fields instanceof Array) {
    return new Configuration(data.fields.map(function (item) {
      var field = new ConfigurationField(item.name, item.defaultValue, item.type, item.description);
      field.value = item.value;
      return field;
    }));
  } else {
    throw 'parse configuration error';
  }
}