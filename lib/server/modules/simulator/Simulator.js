"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require("./../../../sdk");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Simulator = function () {
  function Simulator() {
    _classCallCheck(this, Simulator);
  }

  _createClass(Simulator, [{
    key: "getId",
    value: function getId() {
      return "8ded3b37-7bb1-49c2-871e-48c6b6238b7e";
    }
  }, {
    key: "getInfo",
    value: function getInfo() {
      return new _sdk.Info(this.getId(), "Simulator", "Component simulator", new _sdk.Configuration([new _sdk.ConfigurationField("auto", true, "boolean", "Auto genrate values"), new _sdk.ConfigurationField("delay", 20, "integer", "Delay beetween generated values")]));
    }
  }, {
    key: "onStart",
    value: function onStart(sdk, config) {}
  }, {
    key: "onComponentChange",
    value: function onComponentChange(component) {}
  }, {
    key: "onConfigurationUpdate",
    value: function onConfigurationUpdate(configuration) {}
  }, {
    key: "onStop",
    value: function onStop() {}
  }]);

  return Simulator;
}();

exports.default = Simulator;