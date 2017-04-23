'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component = require('./../../../sdk/Component');

var _Manager2 = require('./Manager');

var _Manager3 = _interopRequireDefault(_Manager2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ComponentManager = function (_Manager) {
  _inherits(ComponentManager, _Manager);

  function ComponentManager() {
    _classCallCheck(this, ComponentManager);

    return _possibleConstructorReturn(this, (ComponentManager.__proto__ || Object.getPrototypeOf(ComponentManager)).apply(this, arguments));
  }

  _createClass(ComponentManager, [{
    key: 'addOrUpdate',
    value: function addOrUpdate(component) {
      var i = this.collection.findIndex(function (item) {
        return item.identifier == component.identifier && item.moduleId == component.moduleId;
      });

      if (i == -1) {
        component.id = (0, _v2.default)();
        this.collection.push(component);
      } else {
        if (JSON.stringify(this.collection[i].values) !== JSON.stringify(component.values)) {
          for (var key in component.values) {
            this.collection[i].values[key] = component.values[key];
          }
        }
      }
    }
  }, {
    key: 'getAllByType',
    value: function getAllByType(type) {
      return this.collection.filter(function (item) {
        return item.type == type;
      });
    }
  }]);

  return ComponentManager;
}(_Manager3.default);

exports.default = ComponentManager;