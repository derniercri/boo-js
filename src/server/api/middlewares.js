// @flow

import Brain from './../brain/Brain';
import type { $Request, $Response } from 'express';
import auth from 'basic-auth';

export default (brain: Brain) => {
  return {
    authMiddleware: (req: $Request, res: $Response, next: any) => {
      const user = auth(req);
      let found = true;

      if (user == null) {
        res.status(401);
        res.send({'message': 'not authenticated'})
      }


      brain.configurationManager.users.map((item) => {
        if (item.name == user.name && item.password == user.pass) {
          found=true;
          next();
        }
      })

      if (!found) {
        res.status(401);
        res.send({'message': 'not authenticated'})
      }
    }
  }
}

