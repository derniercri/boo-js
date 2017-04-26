'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('./../../../sdk');

var _NestStreamingClient = require('./NestStreamingClient');

var _NestStreamingClient2 = _interopRequireDefault(_NestStreamingClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Nest = function () {
  function Nest() {
    _classCallCheck(this, Nest);
  }

  _createClass(Nest, [{
    key: 'getId',
    value: function getId() {
      return '7277de4a-2200-4891-aedd-fbf622c18039';
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return new _sdk.Info(this.getId(), "Nest", "Nest module using streaming API", new _sdk.Configuration([new _sdk.ConfigurationField('token', '', 'string', 'Token'), new _sdk.ConfigurationField('clientId', '', 'string', 'Client ID'), new _sdk.ConfigurationField('clientSecret', '', 'string', 'Client secret'), new _sdk.ConfigurationField('redirectUri', '', 'url', 'Redirect URI'), new _sdk.ConfigurationField('tokenUrl', '', 'url', 'Token URL')]));
    }
  }, {
    key: 'onStart',
    value: function onStart(sdk, config) {
      var tokenField = config.fields.find(function (field) {
        return field.name == 'token';
      });

      if (tokenField != null) {
        var client = new _NestStreamingClient2.default(tokenField.value, sdk);
        client.stream(function (devices) {
          for (var i in devices.thermostats) {
            var device = devices.thermostats[i];
            sdk.addComponent(new _sdk.Temperature(device.device_id, device.name));
          }
        });
      } else {
        sdk.notifyConfigurationError('token config not found');
      }
    }
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

  return Nest;
}();

exports.default = Nest;