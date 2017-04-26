// @flow

import Brain from './../brain/Brain';
import { Module } from './../../sdk';
import type { $Request, $Response } from 'express';
import { parseScene } from './../../sdk/Scene';

export default (brain: Brain) => {
  return {
    getAll: (req: $Request, res: $Response) => {
      res.send(brain.getScenes());
    },
    run:  (req: $Request, res: $Response) => {
      const id = req.param('id');

      if (id) {
        const scene = brain.sceneManager.get(id);
        if (scene) {
          brain.startScene(scene);
          res.statusCode = 201;
          res.send({ message: 'launched' });
        } else {
          res.statusCode = 404;
          res.send({ message: 'not found' });
        }
      } else {
        res.statusCode = 400;
        res.send({ message: 'bad request' });
      }
    },
    create: (req: $Request, res: $Response) => {
      res.setHeader('Content-Type', 'application/json');

      if (req.body instanceof Object) {
        const scene = parseScene(req.body);
        brain.saveScene(scene);

        res.statusCode = 201;
        return res.send(JSON.stringify(scene));
      }

      res.statusCode = 400;
      res.send({ message: 'bad request' });
    },
    update: (req: $Request, res: $Response) => {
      res.setHeader('Content-Type', 'application/json');
      const id = req.param('id');

      if (id) {
        if (req.body instanceof Object) {
          const scene = parseScene(req.body);
          scene.id
          brain.saveScene(scene);

          res.statusCode = 200;
          res.send(JSON.stringify(scene));
        } else {
          res.statusCode = 400;
          res.send({ message: 'bad request' });
        }
      } else {
        res.statusCode = 400;
        res.send({ message: 'bad request' });
      }
    },
    delete: (req: $Request, res: $Response) => {
      res.setHeader('Content-Type', 'application/json');
      const id = req.param('id');

      if (id) {
        if (brain.deleteScene(id)) {
          res.statusCode = 204;
          res.send();
        } else {
          res.statusCode = 404;
          res.send({ message: 'not found' });
        }
      } else {
        res.statusCode = 400;
        res.send({ message: 'bad request' });
      }
    },
  }
}

