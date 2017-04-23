'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = require('./../../../sdk/Component');

var _Configuration = require('./../../../sdk/Configuration');

var _Info = require('./../../../sdk/Info');

var _Info2 = _interopRequireDefault(_Info);

var _Sdk = require('./../../../sdk/Sdk');

var _Sdk2 = _interopRequireDefault(_Sdk);

var _openzwaveShared = require('openzwave-shared');

var _openzwaveShared2 = _interopRequireDefault(_openzwaveShared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ZWave = function () {
  function ZWave() {
    _classCallCheck(this, ZWave);
  }

  _createClass(ZWave, [{
    key: 'getId',
    value: function getId() {
      return 'a8c2e3da-5857-46a4-a5c7-1396e9ab2ecc';
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return new _Info2.default(this.getId(), 'Zwave', 'ZWave support', new _Configuration.Configuration([new _Configuration.ConfigurationField('device', '', 'usb', 'USB dongle')]));
    }
  }, {
    key: 'onStart',
    value: function onStart(sdk, config) {
      var _this = this;

      var deviceField = config.get('device');
      this.values = {};
      var self = this;
      this.sdk = sdk;

      if (deviceField != null) {
        this.device = deviceField.value;
        this.zwave = new _openzwaveShared2.default({
          Logging: false, // disable file logging (OZWLog.txt)
          ConsoleOutput: true // enable console logging
        });

        this.zwave.connect(this.device);

        this.zwave.on('driver ready', function (homeid) {
          sdk.debug('Driver ready');
        });

        this.zwave.on('driver failed', function () {
          sdk.error('Failed to start');
        });

        this.zwave.on('value added', function (nodeid, commandclass, valueId) {
          var device = self.values[nodeid];

          if (device == null) {
            device = {};
          }

          //  Dimmer update value
          if (commandclass == 38 && valueId.instance == 1 && valueId.index == 0) {
            //console.log(nodeid + ' ' +commandclass + ' ' + JSON.stringify(valueId));
            device.position = valueId.value == 0 ? 0 : valueId.value / 255;
          }

          _this.values[nodeid] = device;
        });

        this.zwave.on('node ready', function (nodeid, nodeinfo) {
          var device = void 0;
          var values = self.values[nodeid];

          sdk.debug(nodeinfo);

          switch (nodeinfo.producttype) {
            case '0x0302':
              device = new _Component.Cover(nodeid, nodeinfo.product);
              break;
            default:
              sdk.debug('unsupported device ' + nodeinfo.producttype);
          }

          if (device) {
            if (values) {
              device.values = values;
            }
            sdk.addComponent(device);
          }
        });
      }
    }
  }, {
    key: 'onComponentChange',
    value: function onComponentChange(component) {
      var nodeid = component.identifier;
      this.sdk.logger.debug(component);
      if (component instanceof _Component.Cover) {
        try {
          this.zwave.setValue(nodeid, 38, 1, 0, component.values.position * 100);
        } catch (e) {
          this.sdk.logger.debug(e);
        }
      }
    }
  }, {
    key: 'onConfigurationUpdate',
    value: function onConfigurationUpdate(configuration) {
      this.config = configuration;
    }
  }, {
    key: 'onStop',
    value: function onStop() {
      this.zwave.connect(this.device);
    }
  }]);

  return ZWave;
}();

exports.default = ZWave;