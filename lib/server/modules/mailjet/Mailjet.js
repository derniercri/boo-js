'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Info = require('./../../../sdk/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Sdk = require('./../../../sdk/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _Component = require('./../../../sdk/Component');

var _Configuration = require('./../../../sdk/Configuration');

var _nodeMailjet = require('node-mailjet');

var _nodeMailjet2 = _interopRequireDefault(_nodeMailjet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mailjet = function () {
  function Mailjet() {
    _classCallCheck(this, Mailjet);
  }

  _createClass(Mailjet, [{
    key: 'getId',
    value: function getId() {
      return '76c5429d-acdc-42ac-8d06-e6a5e09a9aad';
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return new _Info2.default(this.getId(), "Mailjet", "Send emails with Mailjet", new _Configuration.Configuration([new _Configuration.ConfigurationField('secret', '', 'string', 'Mailjet secret'), new _Configuration.ConfigurationField('key', '', 'string', 'Mailjet API key')]));
    }
  }, {
    key: 'onStart',
    value: function onStart(sdk, config) {}
  }, {
    key: 'onComponentChange',
    value: function onComponentChange(component) {}
  }, {
    key: 'onConfigurationUpdate',
    value: function onConfigurationUpdate(configuration) {}
  }, {
    key: 'onStop',
    value: function onStop() {}
  }]);

  return Mailjet;
}();

exports.default = Mailjet;