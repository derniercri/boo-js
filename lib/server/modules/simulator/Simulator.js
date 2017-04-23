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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Simulator = function () {
  function Simulator() {
    _classCallCheck(this, Simulator);
  }

  _createClass(Simulator, [{
    key: 'getId',
    value: function getId() {
      return "8ded3b37-7bb1-49c2-871e-48c6b6238b7e";
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return new _Info2.default(this.getId(), "Simulator", "Component simulator", new _Configuration.Configuration([new _Configuration.ConfigurationField("auto", true, "boolean", "Auto genrate values"), new _Configuration.ConfigurationField("delay", 20, "integer", "Delay beetween generated values")]));
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

  return Simulator;
}();

exports.default = Simulator;