'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cover = exports.Weather = exports.Temperature = exports.Light = exports.ColorLight = exports.Component = exports.COVER_TYPE = exports.WEATHER_TYPE = exports.TEMPERATURE_TYPE = exports.COLOR_LIGHT_TYPE = exports.LIGHT_TYPE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.parseComponents = parseComponents;
exports.parseComponent = parseComponent;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LIGHT_TYPE = exports.LIGHT_TYPE = 'LIGHT';
var COLOR_LIGHT_TYPE = exports.COLOR_LIGHT_TYPE = 'COLOR_LIGHT';
var TEMPERATURE_TYPE = exports.TEMPERATURE_TYPE = 'TEMPERATURE';
var WEATHER_TYPE = exports.WEATHER_TYPE = 'WEATHER';
var COVER_TYPE = exports.COVER_TYPE = 'COVER';

var Component = exports.Component = function () {
  function Component(identifier, label) {
    _classCallCheck(this, Component);

    this.identifier = identifier;
    this.label = label;
    this.moduleId = '';
    this.type = '';
    this.values = Object;
  }

  _createClass(Component, [{
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }]);

  return Component;
}();

var ColorLight = exports.ColorLight = function (_Component) {
  _inherits(ColorLight, _Component);

  function ColorLight(identifier, label) {
    _classCallCheck(this, ColorLight);

    var _this = _possibleConstructorReturn(this, (ColorLight.__proto__ || Object.getPrototypeOf(ColorLight)).call(this, identifier, label));

    _this.type = COLOR_LIGHT_TYPE;
    _this.values = {
      on: null,
      brightness: null,
      saturation: null,
      red: null,
      blue: null,
      green: null
    };
    return _this;
  }

  _createClass(ColorLight, [{
    key: 'setOn',
    value: function setOn(val) {
      this.values.on = val;
    }
  }, {
    key: 'setBrightness',
    value: function setBrightness(val) {
      this.values.brightness = val;
    }
  }, {
    key: 'setSaturation',
    value: function setSaturation(val) {
      this.values.saturation = val;
    }
  }, {
    key: 'setRGB',
    value: function setRGB(r, g, b) {
      this.values.red = r;
      this.values.green = g;
      this.values.blue = b;
    }
  }]);

  return ColorLight;
}(Component);

var Light = exports.Light = function (_Component2) {
  _inherits(Light, _Component2);

  function Light(identifier, label) {
    _classCallCheck(this, Light);

    var _this2 = _possibleConstructorReturn(this, (Light.__proto__ || Object.getPrototypeOf(Light)).call(this, identifier, label));

    _this2.type = LIGHT_TYPE;
    _this2.values = {
      on: null,
      brightness: null
    };
    return _this2;
  }

  _createClass(Light, [{
    key: 'setOn',
    value: function setOn(val) {
      this.values.on = val;
    }
  }, {
    key: 'setBrightness',
    value: function setBrightness(val) {
      this.values.brightness = val;
    }
  }]);

  return Light;
}(Component);

var Temperature = exports.Temperature = function (_Component3) {
  _inherits(Temperature, _Component3);

  function Temperature(identifier, label) {
    _classCallCheck(this, Temperature);

    var _this3 = _possibleConstructorReturn(this, (Temperature.__proto__ || Object.getPrototypeOf(Temperature)).call(this, identifier, label));

    _this3.type = TEMPERATURE_TYPE;
    _this3.values = {};
    return _this3;
  }

  return Temperature;
}(Component);

var Weather = exports.Weather = function (_Component4) {
  _inherits(Weather, _Component4);

  function Weather(identifier, label) {
    _classCallCheck(this, Weather);

    var _this4 = _possibleConstructorReturn(this, (Weather.__proto__ || Object.getPrototypeOf(Weather)).call(this, identifier, label));

    _this4.type = WEATHER_TYPE;
    _this4.values = {
      sunset: null,
      sunrise: null,
      temp: null,
      code: null,
      text: null
    };
    return _this4;
  }

  _createClass(Weather, [{
    key: 'set',
    value: function set(sunset, sunrise, temp, code, text) {
      this.values = {
        sunset: sunset,
        sunrise: sunrise,
        temp: temp,
        code: code,
        text: text
      };
    }
  }]);

  return Weather;
}(Component);

var Cover = exports.Cover = function (_Component5) {
  _inherits(Cover, _Component5);

  function Cover(identifier, label) {
    _classCallCheck(this, Cover);

    var _this5 = _possibleConstructorReturn(this, (Cover.__proto__ || Object.getPrototypeOf(Cover)).call(this, identifier, label));

    _this5.type = COVER_TYPE;
    _this5.values = {
      position: 0.0
    };
    return _this5;
  }

  return Cover;
}(Component);

function parseComponents(data) {
  return data.map(function (item) {
    return parseComponent(item);
  });
}

function parseComponent(data) {
  var component = void 0;

  switch (data.type) {
    case LIGHT_TYPE:
      component = new Light(data.identifier, data.label);
      break;
    case COLOR_LIGHT_TYPE:
      component = new ColorLight(data.identifier, data.label);
      break;
    case TEMPERATURE_TYPE:
      component = new Temperature(data.identifier, data.label);
      break;
    case WEATHER_TYPE:
      component = new Weather(data.identifier, data.label);
      break;
    case COVER_TYPE:
      component = new Cover(data.identifier, data.label);
      break;
    default:
      throw 'unknow component ' + data.type;
  }

  component.moduleId = data.moduleId;
  component.values = data.values;
  component.id = data.id;

  return component;
}