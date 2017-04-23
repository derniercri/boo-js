'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = require('./../../sdk/Event');

var _Event2 = _interopRequireDefault(_Event);

var _Scene = require('./../../sdk/Scene');

var _Component = require('./../../sdk/Component');

var _ComponentManager = require('./memory/ComponentManager');

var _ComponentManager2 = _interopRequireDefault(_ComponentManager);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SUNSET = 'sunset';

var EventManager = function () {
  function EventManager(componentManager, logger) {
    _classCallCheck(this, EventManager);

    this.componentManager = componentManager;
    this.logger = logger;
    this.state = {
      sunset: null
    };
  }

  _createClass(EventManager, [{
    key: 'handle',
    value: function handle(event, scenes) {
      var self = this;

      if (event instanceof _Event.TimeChangeEvent) {
        return self.handleTimeChange(event, scenes);
      } else {
        throw 'unknow event type ' + event.type;
      }
    }
  }, {
    key: 'handleTimeChange',
    value: function handleTimeChange(event, scenes) {
      var _this = this;

      var self = this;
      var validScenes = [];

      this.componentManager.getAllByType(_Component.WEATHER_TYPE).map(function (item) {
        if (item.values.sunset != null && item.values.sunrise != null) {
          if (self.updateState(SUNSET, event.time.diff((0, _moment2.default)(item.values.sunset)) > 0)) {
            // Find SUNSET or SUNRISE events
            var lookup = _this.state.sunset == true ? _Scene.TRIGGER_SUNSET : _Scene.TRIGGER_SUNRISE;

            _this.logger.debug('lookup for ' + lookup);
            validScenes = scenes.filter(function (item) {
              return item.triggers.find(function (trigger) {
                self.logger.debug(trigger.type + ' === ' + lookup);
                return trigger.type === lookup;
              });
            });
          }
        }
      });

      return validScenes;
    }
  }, {
    key: 'updateState',
    value: function updateState(key, value) {
      if (this.state[key] != value) {
        this.state[key] = value;
        this.logger.debug('switched ' + key + ' to ' + value);
        return true;
      }

      return false;
    }
  }, {
    key: 'getState',
    value: function getState(key) {
      return this.state[key];
    }
  }]);

  return EventManager;
}();

exports.default = EventManager;