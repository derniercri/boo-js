'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sdk = require('./../../../sdk');

var _nodeHueApi = require('node-hue-api');

var _nodeHueApi2 = _interopRequireDefault(_nodeHueApi);

var _factory = require('./factory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hue = function () {
  function Hue() {
    _classCallCheck(this, Hue);
  }

  _createClass(Hue, [{
    key: 'getId',
    value: function getId() {
      return "2d7c7893-f8de-41df-8cb3-61315826f2ff";
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return new _sdk.Info(this.getId(), "Hue", "Philips HUE module", new _sdk.Configuration([new _sdk.ConfigurationField('address', '', 'url', 'Address of the Hue controller'), new _sdk.ConfigurationField('user', '', 'string', 'User registered on the Hue controller')]));
    }
  }, {
    key: 'onStart',
    value: function onStart(sdk, config) {
      var self = this;
      var address = config.get('address');
      var user = config.get('user');

      if (user != null && address != null) {
        if (user.value == null || address.value == null) {
          sdk.debug('looking for Hue bridges');
          this.find(sdk);
        } else {
          sdk.info('connecting to ' + user.value + ':' + address.value);
          try {
            this.api = new _nodeHueApi.HueApi(address.value, user.value);
          } catch (e) {
            sdk.notifyConfigurationError('Unable to connect to ' + address.value);
          }
        }

        try {
          self.update(sdk);
        } catch (e) {
          sdk.error(e);
        }
      } else {
        sdk.error('missing configuration fields');
      }
    }
  }, {
    key: 'onComponentChange',
    value: function onComponentChange(component) {
      if (component instanceof _sdk.Light) {
        this.api.setLightState(component.identifier, { 'on': component.values.on, 'bri': 255 * component.values.brightness }).then(function (result) {}).fail(function (error) {}).done();
      } else if (component instanceof _sdk.ColorLight) {}
    }
  }, {
    key: 'update',
    value: function update(sdk) {
      var self = this;
      if (this.api != null) {
        this.api.getFullState().then(function (result) {
          var components = (0, _factory.createComponents)(result);
          components.map(function (component) {
            sdk.addComponent(component);
          });
        }).done(setTimeout(function () {
          self.update(sdk);
        }, 3000));
      }
    }
  }, {
    key: 'find',
    value: function find(sdk) {
      _nodeHueApi2.default.nupnpSearch().then(function (bridges) {
        bridges.map(function (bridge) {
          var api = new _nodeHueApi.HueApi();
          api.registerUser(bridge.ipaddress, '').then(function (user) {
            sdk.updateConfiguration('user', user);
            sdk.updateConfiguration('address', bridge.ipaddress);
            self.api = new _nodeHueApi.HueApi(bridge.ipaddress, user);
          }).fail(function (error) {
            sdk.notifyConfigurationError(error);
          }).done();
        });
      }).done();
    }
  }, {
    key: 'onConfigurationUpdate',
    value: function onConfigurationUpdate(configuration) {}
  }, {
    key: 'onStop',
    value: function onStop() {}
  }]);

  return Hue;
}();

exports.default = Hue;