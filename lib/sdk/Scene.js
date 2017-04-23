'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = exports.StateChangeAction = exports.Trigger = exports.Action = exports.TRIGGER_SUNSET = exports.TRIGGER_SUNRISE = exports.ACTION_STATE_CHANGE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.parseScenes = parseScenes;
exports.parseScene = parseScene;

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ACTION_STATE_CHANGE = exports.ACTION_STATE_CHANGE = 'STATE';
var TRIGGER_SUNRISE = exports.TRIGGER_SUNRISE = 'SUNRISE';
var TRIGGER_SUNSET = exports.TRIGGER_SUNSET = 'SUNSET';

var Action = exports.Action = function Action() {
  _classCallCheck(this, Action);
};

var Trigger = exports.Trigger = function Trigger() {
  _classCallCheck(this, Trigger);
};

var StateChangeAction = exports.StateChangeAction = function (_Action) {
  _inherits(StateChangeAction, _Action);

  function StateChangeAction(componentId, name, value) {
    _classCallCheck(this, StateChangeAction);

    var _this = _possibleConstructorReturn(this, (StateChangeAction.__proto__ || Object.getPrototypeOf(StateChangeAction)).call(this));

    _this.type = ACTION_STATE_CHANGE;
    _this.componentId = componentId;
    _this.name = name;
    _this.value = value;
    return _this;
  }

  return StateChangeAction;
}(Action);

var Scene = exports.Scene = function () {
  function Scene() {
    _classCallCheck(this, Scene);

    this.id = (0, _v2.default)();
  }

  _createClass(Scene, [{
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }]);

  return Scene;
}();

function parseScenes(data) {
  return data.map(function (item) {
    return parseScene(item);
  });
}

function parseScene(data) {
  var scene = new Scene();
  if (data.id) {
    scene.id = data.id;
  }
  scene.description = data.description;
  scene.name = data.name;
  scene.sequence = parseActions(data.sequence);
  scene.triggers = parseTriggers(data.triggers);

  return scene;
}

function parseActions(data) {
  return data.map(function (item) {
    return parseAction(item);
  });
}

function parseAction(data) {
  var action = void 0;

  switch (data.type) {
    case ACTION_STATE_CHANGE:
      action = new StateChangeAction(data.componentId, data.name, data.value);
      break;
    default:
      throw 'unknow action ' + data.type;
  }

  return action;
}

function parseTriggers(data) {
  return data.map(function (item) {
    return parseTrigger(item);
  });
}

function parseTrigger(data) {
  var trigger = new Trigger();
  trigger.type = data.type;

  return trigger;
}