'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _Module = require('./../../sdk/Module');

var _Scene = require('./../../sdk/Scene');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain) {
  return {
    getAll: function getAll(req, res) {
      res.send(brain.getScenes());
    },
    run: function run(req, res) {
      var id = req.param('id');

      if (id) {
        var scene = brain.sceneManager.get(id);
        if (scene) {
          brain.startScene(scene);
          res.statusCode = 201;
          res.send({ message: 'launched' });
        } else {
          res.statusCode = 404;
          res.send({ message: 'not found' });
        }
      } else {
        res.statusCode = 400;
        res.send({ message: 'bad request' });
      }
    },
    create: function create(req, res) {
      res.setHeader('Content-Type', 'application/json');

      if (req.body instanceof Object) {
        var scene = (0, _Scene.parseScene)(req.body);
        brain.saveScene(scene);

        res.statusCode = 201;
        return res.send(JSON.stringify(scene));
      }

      res.statusCode = 400;
      res.send({ message: 'bad request' });
    },
    update: function update(req, res) {
      res.setHeader('Content-Type', 'application/json');
      var id = req.param('id');

      if (id) {
        if (req.body instanceof Object) {
          var scene = (0, _Scene.parseScene)(req.body);
          scene.id;
          brain.saveScene(scene);

          res.statusCode = 200;
          res.send(JSON.stringify(scene));
        } else {
          res.statusCode = 400;
          res.send({ message: 'bad request' });
        }
      } else {
        res.statusCode = 400;
        res.send({ message: 'bad request' });
      }
    },
    delete: function _delete(req, res) {
      res.setHeader('Content-Type', 'application/json');
      var id = req.param('id');

      if (id) {
        if (brain.deleteScene(id)) {
          res.statusCode = 204;
          res.send();
        } else {
          res.statusCode = 404;
          res.send({ message: 'not found' });
        }
      } else {
        res.statusCode = 400;
        res.send({ message: 'bad request' });
      }
    }
  };
};