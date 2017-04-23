// @flow

import Brain from './../brain/Brain';
import { ActionsSdkAssistant } from 'actions-on-google';
import type { $Request, $Response } from 'express';
import Winston from 'winston';

export default (brain: Brain, logger: Winston) => {
  return {
    handle: (req: $Request, res: $Response) => {
      logger.debug(JSON.stringify(req.body));
      const assistant = new ActionsSdkAssistant({request: req, response: res});

      let mainIntent = (assistant) => {
        let inputPrompt = assistant.buildInputPrompt(true, '<speak>Hi! <break time="1"/> ' +
          'I can read out an ordinal like ' +
          '<say-as interpret-as="ordinal">123</say-as>. Say a number.</speak>',
          ['I didn\'t hear a number', 'If you\'re still there, what\'s the number?', 'What is the number?']);
          assistant.ask(inputPrompt);
      }

      let rawInput = (assistant) => {
        if (assistant.getRawInput() === 'bye') {
          assistant.tell('Goodbye!');
        } else {
          let inputPrompt = assistant.buildInputPrompt(true, '<speak>You said, <say-as interpret-as="ordinal">' +
            assistant.getRawInput() + '</say-as></speak>',
            ['I didn\'t hear a number', 'If you\'re still there, what\'s the number?', 'What is the number?']);
            assistant.ask(inputPrompt);
        }
      }

      let actionMap = new Map();
      actionMap.set(assistant.StandardIntents.MAIN, mainIntent);
      actionMap.set(assistant.StandardIntents.TEXT, rawInput);

      assistant.handleRequest(actionMap);
    }
  }
}
