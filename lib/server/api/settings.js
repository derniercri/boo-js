'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (address) {
  return {
    getAll: function getAll(req, res) {
      res.send({ address: address });
    }
  };
};