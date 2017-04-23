'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _actionsOnGoogle = require('actions-on-google');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain, logger) {
  return {
    handle: function handle(req, res) {
      logger.debug(JSON.stringify(req.body));
      var assistant = new _actionsOnGoogle.ActionsSdkAssistant({ request: req, response: res });

      var mainIntent = function mainIntent(assistant) {
        var inputPrompt = assistant.buildInputPrompt(true, '<speak>Hi! <break time="1"/> ' + 'I can read out an ordinal like ' + '<say-as interpret-as="ordinal">123</say-as>. Say a number.</speak>', ['I didn\'t hear a number', 'If you\'re still there, what\'s the number?', 'What is the number?']);
        assistant.ask(inputPrompt);
      };

      var rawInput = function rawInput(assistant) {
        if (assistant.getRawInput() === 'bye') {
          assistant.tell('Goodbye!');
        } else {
          var inputPrompt = assistant.buildInputPrompt(true, '<speak>You said, <say-as interpret-as="ordinal">' + assistant.getRawInput() + '</say-as></speak>', ['I didn\'t hear a number', 'If you\'re still there, what\'s the number?', 'What is the number?']);
          assistant.ask(inputPrompt);
        }
      };

      var actionMap = new Map();
      actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
      actionMap.set(assistant.StandardIntents.TEXT, rawInput);

      assistant.handleRequest(actionMap);
    }
  };
};