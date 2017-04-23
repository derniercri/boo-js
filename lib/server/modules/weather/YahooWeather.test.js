'use strict';

var _YahooWeather = require('./YahooWeather');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('test Time parsing', function () {
  var time = (0, _YahooWeather.parseTime)('3:15 pm');
  var now = (0, _moment2.default)();
  expect(time.format('MM DD YY')).toBe(now.format('MM DD YY'));
});