// @flow

import Brain from './../brain/Brain';
import type { $Request, $Response } from 'express';

export default (brain: Brain) => {
  return {
    create: (req: $Request, res: $Response) => {
      res.setHeader('Content-Type', 'application/json');

      if (req.body instanceof Object && req.body.words instanceof Array) {
        brain.handleCommands(req.body.words);
        res.statusCode = 201;
        return res.send({message: 'accepted'});
      }

      res.statusCode = 400;
      res.send({ message: 'bad request' });
    }
  }
}

