'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeChangeEvent = exports.TIME_CHANGE = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TIME_CHANGE = exports.TIME_CHANGE = 'TIME_CHANGE';

var Event = function Event(type) {
  _classCallCheck(this, Event);

  this.type = type;
};

exports.default = Event;

var TimeChangeEvent = exports.TimeChangeEvent = function (_Event) {
  _inherits(TimeChangeEvent, _Event);

  function TimeChangeEvent(time) {
    _classCallCheck(this, TimeChangeEvent);

    var _this = _possibleConstructorReturn(this, (TimeChangeEvent.__proto__ || Object.getPrototypeOf(TimeChangeEvent)).call(this, TIME_CHANGE));

    _this.time = time;
    return _this;
  }

  return TimeChangeEvent;
}(Event);