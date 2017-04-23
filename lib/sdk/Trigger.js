'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.parseTriggers = parseTriggers;
exports.parseTrigger = parseTrigger;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TRIGGER_STATE = exports.TRIGGER_STATE = 'STATE';

var Trigger = exports.Trigger = function () {
    function Trigger(id, name, description, type) {
        _classCallCheck(this, Trigger);

        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
    }

    _createClass(Trigger, [{
        key: 'getId',
        value: function getId() {
            return this.id;
        }
    }]);

    return Trigger;
}();

var StateTrigger = exports.StateTrigger = function (_Trigger) {
    _inherits(StateTrigger, _Trigger);

    function StateTrigger(id, name, description) {
        _classCallCheck(this, StateTrigger);

        return _possibleConstructorReturn(this, (StateTrigger.__proto__ || Object.getPrototypeOf(StateTrigger)).call(this, id, name, description, TRIGGER_STATE));
    }

    return StateTrigger;
}(Trigger);

function parseTriggers(data) {
    return data.map(function (item) {
        return parseTrigger(item);
    });
}

function parseTrigger(data) {
    var trigger = void 0;

    switch (data.type) {
        case TRIGGER_STATE:
            trigger = new StateTrigger(data.id, data.name, data.description);
            trigger.from = data.from;
            trigger.to = data.to;
            trigger.field = data.field;
            trigger.entity = data.entity;
            trigger.entityType = data.entityType;
            break;
        default:
            throw 'unknow trigger type ' + data.type;
    }

    return trigger;
}