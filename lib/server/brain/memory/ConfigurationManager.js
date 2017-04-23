'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _Configuration = require('./../../../sdk/Configuration');

var _Info = require('./../../../sdk/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConfigurationItem = function () {
  function ConfigurationItem(moduleId, name, value) {
    _classCallCheck(this, ConfigurationItem);

    this.moduleId = moduleId;
    this.name = name;
    this.value = value;
  }

  _createClass(ConfigurationItem, [{
    key: 'getId',
    value: function getId() {
      return this.moduleId + this.name;
    }
  }]);

  return ConfigurationItem;
}();

var ModuleManager = function () {
  function ModuleManager(path) {
    _classCallCheck(this, ModuleManager);

    this.filePath = path;
    this.status = {};
    this.serverId = (0, _v2.default)().split('-').join('');
    this.collection = [];
  }

  _createClass(ModuleManager, [{
    key: 'setEnabled',
    value: function setEnabled(moduleId, enabled) {
      this.status[moduleId] = enabled;
    }
  }, {
    key: 'isEnabled',
    value: function isEnabled(moduleId) {
      return this.status[moduleId] === true ? true : false;
    }
  }, {
    key: 'add',
    value: function add(moduleId, config) {
      var _this = this;

      config.fields.map(function (field) {
        if (_this.get(moduleId, field.name) == null) {
          _this.collection.push(new ConfigurationItem(moduleId, field.name, field.value));
        }
      });
    }
  }, {
    key: 'update',
    value: function update(moduleId, name, value) {
      this.collection = this.collection.map(function (item) {
        if (item.moduleId == moduleId && item.name == name) {
          item.value = value;
        }
        return item;
      });
    }
  }, {
    key: 'generateConfiguration',
    value: function generateConfiguration(moduleId, config) {
      var self = this;
      config.fields = config.fields.map(function (field) {
        var item = self.get(moduleId, field.name);
        if (item != null) {
          field.value = item.value;
        }
        return field;
      });

      return config;
    }
  }, {
    key: 'get',
    value: function get(moduleId, name) {
      return this.collection.find(function (item) {
        return item.moduleId == moduleId && item.name == name;
      });
    }
  }, {
    key: 'save',
    value: function save() {
      _fs2.default.writeFileSync(this.filePath, JSON.stringify({
        serverId: this.serverId,
        status: this.status,
        fields: this.collection
      }, null, 4));
    }
  }, {
    key: 'read',
    value: function read() {
      try {
        var data = JSON.parse(_fs2.default.readFileSync(this.filePath).toString());
        this.collection = data.fields;
        this.status = data.status;
        this.serverId = data.serverId;
      } catch (e) {
        this.save();
      }
    }
  }]);

  return ModuleManager;
}();

exports.default = ModuleManager;