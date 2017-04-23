'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Info = require('./Info');

var _Info2 = _interopRequireDefault(_Info);

var _Component = require('./Component');

var _Scene = require('./Scene');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var headers = {
  'Content-Type': 'application/json'
};

var BooAPI = function () {
  function BooAPI(url) {
    _classCallCheck(this, BooAPI);

    this.url = url;
  }

  _createClass(BooAPI, [{
    key: 'getModules',
    value: function getModules() {
      var modules = [];

      return modules;
    }
  }, {
    key: 'getComponents',
    value: function getComponents() {
      return fetch(this.url + '/api/v1/components').then(function (res) {
        return res.text();
      }).then(function (body) {
        return (0, _Component.parseComponents)(JSON.parse(body));
      });
    }
  }, {
    key: 'setValues',
    value: function setValues(id, values) {
      return fetch(this.url + '/api/v1/components/' + id, { method: 'PUT', headers: headers, body: JSON.stringify({ values: values }) }).then(function (res) {
        return res.text();
      }).then(function (body) {
        return (0, _Component.parseComponent)(JSON.parse(body));
      });
    }
  }, {
    key: 'fetchModules',
    value: function fetchModules() {
      return fetch(this.url + '/api/v1/modules').then(function (res) {
        return res.text();
      }).then(function (body) {
        return (0, _Info.parseInfos)(JSON.parse(body));
      });
    }
  }, {
    key: 'fetchScenes',
    value: function fetchScenes() {
      return fetch(this.url + '/api/v1/scenes').then(function (res) {
        return res.text();
      }).then(function (body) {
        return (0, _Scene.parseScenes)(JSON.parse(body));
      });
    }
  }, {
    key: 'saveScene',
    value: function saveScene(scene) {
      var method = scene.id ? 'PUT' : 'POST';
      var url = this.url + '/api/v1/scenes' + scene.id ? '/' + scene.id : '';
      return fetch(url, { method: method, headers: headers, body: JSON.stringify(scene) }).then(function (res) {
        return res.text();
      }).then(function (body) {
        return (0, _Scene.parseScene)(JSON.parse(body));
      });
    }
  }, {
    key: 'saveModule',
    value: function saveModule(module) {
      return fetch(this.url + '/api/v1/modules/' + module.id, { method: 'PUT', headers: headers, body: JSON.stringify(module) }).then(function (res) {
        return res.text();
      }).then(function (body) {
        return (0, _Info.parseInfo)(JSON.parse(body));
      });
    }
  }, {
    key: 'launch',
    value: function launch(id) {
      return fetch(this.url + '/api/v1/scenes/' + id + '/launch', { method: 'POST', headers: headers, body: JSON.stringify({}) });
    }
  }]);

  return BooAPI;
}();

exports.default = BooAPI;