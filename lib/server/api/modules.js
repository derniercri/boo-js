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
      res.send(brain.getModules());
    },
    update: function update(req, res) {
      var item = brain.getModule(req.params.id);

      if (item != null) {
        var configuration = item.configuration;

        if (req.body != null && req.body.configuration != null && req.body.configuration.fields instanceof Array) {
          var enable = void 0;
          if (typeof req.body.enabled === 'boolean') {
            enable = req.body.enabled;
          }

          var fields = req.body.configuration.fields.map(function (newField) {
            var foundItem = configuration.fields.find(function (configField) {
              return configField.name == newField.name;
            });

            if (foundItem) {
              foundItem.value = newField.value;
              return foundItem;
            }
          }).filter(function (item) {
            return item != null;
          });

          brain.updateConfigurationFields(item.id, fields);
          if (enable != null) {
            brain.setEnabled(req.params.id, enable);
          }
          res.send(item);
        } else {
          res.statusCode = 400;
          res.send({ message: 'bad request' });
        }
      } else {
        res.statusCode = 404;
        res.send({ message: 'not found' });
      }
    }
  };
};