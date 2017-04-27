'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.parseTime = parseTime;

var _sdk = require('./../../../sdk');

var _yahooWeather = require('yahoo-weather');

var _yahooWeather2 = _interopRequireDefault(_yahooWeather);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var YahooWeather = function () {
  function YahooWeather() {
    _classCallCheck(this, YahooWeather);
  }

  _createClass(YahooWeather, [{
    key: 'getId',
    value: function getId() {
      return "80ad2b23-69c7-47c8-88e8-387c4345cbe5";
    }
  }, {
    key: 'getInfo',
    value: function getInfo() {
      return new _sdk.Info(this.getId(), "Weather", "Weather from Yahoo", new _sdk.Configuration([new _sdk.ConfigurationField("location", "", "string", "Location of the weather")]));
    }
  }, {
    key: 'onStart',
    value: function onStart(sdk, config) {
      var locationField = config.get('location');

      if (locationField != null && locationField.value != '' && locationField.value != null) {
        this.update(sdk, locationField.value);
      } else {
        sdk.notifyConfigurationError('location not set');
      }
    }
  }, {
    key: 'update',
    value: function update(sdk, location) {
      var self = this;

      (0, _yahooWeather2.default)(location).then(function (info) {
        if (info != null) {
          var _weather = new _sdk.Weather('yahoo', 'Yahoo Weather');
          _weather.set(parseTime(info.astronomy.sunset).unix(), parseTime(info.astronomy.sunrise).unix(), parseInt(info.item.condition.temp), parseInt(info.item.condition.code));

          sdk.addComponent(_weather);

          setTimeout(function () {
            self.update(sdk, location);
          }, 60 * 60 * 1000); //Update in 1 hour
        } else {
          setTimeout(function () {
            self.update(sdk, location);
          }, 500);
        }
      }).catch(function (err) {
        sdk.notifyConfigurationError(err);
        sdk.error(err);
      });
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

  return YahooWeather;
}();

exports.default = YahooWeather;
function parseTime(time) {
  return (0, _moment2.default)(time, 'h:mm a');
}