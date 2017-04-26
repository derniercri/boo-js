'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _sdk = require('./../../sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain) {
  return {
    getAll: function getAll(req, res) {
      res.send(brain.getComponents());
    },
    update: function update(req, res) {
      var item = brain.getComponent(req.params.id);

      if (item == null) {
        res.statusCode = 404;
        res.send({ message: 'not found' });
      } else {
        if (req.body != null) {
          if (typeof req.body.label == 'string') {
            item.label = req.body.label;
          }
          if (req.body.values instanceof Object) {
            item.values = req.body.values;
          }
          brain.updateComponent(item);
          res.send(brain.getComponent(item.id));
        } else {
          res.statusCode = 400;
          res.send({ message: 'bad request' });
        }
      }
    }
  };
};