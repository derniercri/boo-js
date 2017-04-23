'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Identifiable = require('./../../../sdk/Identifiable');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
  function Manager(path, parseFunc) {
    _classCallCheck(this, Manager);

    this.filePath = path;
    this.collection = [];
    this.parseFunc = parseFunc;
  }

  _createClass(Manager, [{
    key: 'addOrUpdate',
    value: function addOrUpdate(item) {
      var i = this.findIndex(item);
      if (i == -1) {
        this.collection.push(item);
      } else {
        if (JSON.stringify(this.collection[i]) !== JSON.stringify(item)) {
          // The Item is updated only if it has changed
          this.collection[i] = item;
        }
      }
    }
  }, {
    key: 'findIndex',
    value: function findIndex(item) {
      return this.collection.findIndex(function (element) {
        return item.getId() == element.getId();
      });
    }
  }, {
    key: 'get',
    value: function get(id) {
      return this.collection.find(function (item) {
        return item.getId() == id;
      });
    }
  }, {
    key: 'delete',
    value: function _delete(id) {
      var i = this.collection.findIndex(function (element) {
        return id == element.getId();
      });

      if (i === -1) {
        return false;
      }
      this.collection.splice(i, 1);
      return true;
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return this.collection;
    }
  }, {
    key: 'save',
    value: function save() {
      _fs2.default.writeFileSync(this.filePath, JSON.stringify(this.collection, null, 4));
    }
  }, {
    key: 'read',
    value: function read() {
      try {
        var data = _fs2.default.readFileSync(this.filePath);
        var func = this.parseFunc;
        if (func != null) {
          this.collection = func(JSON.parse(data.toString()));
        }
      } catch (e) {
        this.save(); // The file do not exists, so we create it
      }
    }
  }]);

  return Manager;
}();

exports.default = Manager;