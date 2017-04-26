'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sdk = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = require('./Component');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sdk = exports.Sdk = function () {
  function Sdk(logger, pluginId, configUpdateCb, addComponentCb) {
    _classCallCheck(this, Sdk);

    this.logger = logger;
    this.moduleId = pluginId;
    this.configUpdateCb = configUpdateCb;
    this.addComponentCb = addComponentCb;
  }

  _createClass(Sdk, [{
    key: 'addComponent',
    value: function addComponent(component) {
      component.moduleId = this.moduleId;
      this.addComponentCb(component);
    }
  }, {
    key: 'updateConfiguration',
    value: function updateConfiguration(name, value) {
      this.info('Updating configuration ' + name + ' to ' + value);
      this.configUpdateCb(this.moduleId, name, value);
    }
  }, {
    key: 'notifyConfigurationError',
    value: function notifyConfigurationError(message) {
      this.warn(message);
    }
  }, {
    key: 'error',
    value: function error(message) {
      this.log('error', message);
    }
  }, {
    key: 'warn',
    value: function warn(message) {
      this.log('warn', message);
    }
  }, {
    key: 'info',
    value: function info(message) {
      this.log('info', message);
    }
  }, {
    key: 'debug',
    value: function debug(message) {
      this.log('debug', message);
    }
  }, {
    key: 'log',
    value: function log(level, message) {
      this.logger.log(level, { pluginId: this.moduleId, message: message });
    }
  }]);

  return Sdk;
}();