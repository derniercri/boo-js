// @flow

import Brain from './../brain/Brain';
import { Module } from './../../sdk';
import type { $Request, $Response } from 'express';

export default (brain: Brain) => {
  return {
    getAll: (req: $Request, res: $Response) => {
      res.send(brain.getModules());
    },
    update: (req: $Request, res: $Response) => {
      let item = brain.getModule(req.params.id);

      if (item != null) {
        let configuration = item.configuration;

        if (
          req.body != null &&
          req.body.configuration != null &&
          req.body.configuration.fields instanceof Array) {
          let enable: ?boolean;
          if (typeof req.body.enabled === 'boolean') { enable = req.body.enabled }

          let fields = req.body.configuration.fields.map((newField) => {
            let foundItem = configuration.fields.find((configField) => {
              return configField.name == newField.name
            })

            if (foundItem) {
              foundItem.value = newField.value;
              return foundItem;
            }
          }).filter((item) => { return item != null })

          brain.updateConfigurationFields(item.id, fields);
          if (enable != null) { brain.setEnabled(req.params.id, enable) }
          res.send(item);
        } else {
          res.statusCode = 400;
          res.send({ message: 'bad request' })
        }
      } else {
        res.statusCode = 404;
        res.send({ message: 'not found' })
      }
    }
  }
}
