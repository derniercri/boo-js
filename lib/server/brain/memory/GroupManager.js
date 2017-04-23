'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Group = require('./../../../sdk/Group');

var _Manager2 = require('./Manager');

var _Manager3 = _interopRequireDefault(_Manager2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModuleManager = function (_Manager) {
  _inherits(ModuleManager, _Manager);

  function ModuleManager() {
    _classCallCheck(this, ModuleManager);

    return _possibleConstructorReturn(this, (ModuleManager.__proto__ || Object.getPrototypeOf(ModuleManager)).apply(this, arguments));
  }

  return ModuleManager;
}(_Manager3.default);

exports.default = ModuleManager;