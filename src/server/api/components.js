// @flow

import Brain from './../brain/Brain';
import { parseComponent } from './../../sdk/Component';
import type { $Request, $Response } from 'express';

export default (brain: Brain) => {
  return {
    getAll: (req: $Request, res: $Response) => {
      res.send(brain.getComponents());
    },
    update: (req: $Request, res: $Response) => {
      let item = brain.getComponent(req.params.id);

      if (item == null) {
        res.statusCode = 404;
        res.send({ message: 'not found' })
      } else {
        if (req.body != null) {
          if (typeof req.body.label == 'string') { item.label = req.body.label; }
          if (req.body.values instanceof Object) { item.values = req.body.values; }
          brain.updateComponent(item);
          res.send(brain.getComponent(item.id));
        } else {
          res.statusCode = 400;
          res.send({ message: 'bad request' })
        }
      }
    }
  }
}
