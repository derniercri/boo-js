'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _basicAuth = require('basic-auth');

var _basicAuth2 = _interopRequireDefault(_basicAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain) {
  return {
    authMiddleware: function authMiddleware(req, res, next) {
      var user = (0, _basicAuth2.default)(req);
      console.log(user);
    }
  };
};