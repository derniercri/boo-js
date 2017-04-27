'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain) {
  return {
    create: function create(req, res) {
      res.setHeader('Content-Type', 'application/json');

      if (req.body instanceof Object && req.body.words instanceof Array) {
        brain.handleCommands(req.body.words);
        res.statusCode = 201;
        return res.send({ message: 'J\'ai bien compris.' });
      }

      res.statusCode = 400;
      res.send({ message: 'bad request' });
    }
  };
};