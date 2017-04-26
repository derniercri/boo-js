// @flow

import Brain from './../brain/Brain';
import { Module } from './../../sdk';
import ClientOAuth2, { Token } from 'client-oauth2';
import type { $Request, $Response } from 'express';

export default (brain: Brain) => {
  return {
    getAuthorizationCode: (req: $Request, res: $Response) => {
      let item = brain.getModule(req.params.id);

      if (item != null) {
        let configuration = item.configuration;

        let clientIdField = configuration.fields.find((configField) => {
          return configField.name == 'clientId'
        })

        let clientSecretField = configuration.fields.find((configField) => {
          return configField.name == 'clientSecret'
        })

        let tokenField = configuration.fields.find((configField) => {
          return configField.name == 'token'
        })

        let redirectField = configuration.fields.find((configField) => {
          return configField.name == 'redirectUri'
        })

        let tokenUrlField = configuration.fields.find((configField) => {
          return configField.name == 'tokenUrl'
        })

        if (clientIdField != null && clientSecretField != null &&
          tokenField != null && redirectField != null &&
          tokenUrlField != null
        ) {

          const credentials = {
            client: {
              id: clientIdField.value,
              secret: clientSecretField.value
            },
            auth: {
              tokenHost: tokenUrlField.value,
              tokenPath: tokenUrlField.value,
            }
          };

          const tokenConfig = {
            code: req.query.code,
            redirect_uri: redirectField.value
          };

          // Initialize the OAuth2 Library
          const oauth2 = require('simple-oauth2').create(credentials);
          oauth2.authorizationCode.getToken(tokenConfig)
            .then((result: Token) => {
              console.log('received token');
              console.log(result);
              const token = oauth2.accessToken.create(result);

              if (tokenField != null && item != null) {
                tokenField.value = result;
                brain.updateConfigurationFields(item.id, [tokenField]);
              }

              if (req.body != null && typeof req.body.enabled === 'boolean') {
                if (req.body.enabled) { brain.setEnabled(req.params.id, req.body.enabled) }
                res.send(item);
                return;
              } else {
                res.statusCode = 400;
                res.send({ message: 'invalid request' });
              }
            })
            .catch((error: Error) => {
              res.statusCode = 500;
              res.send(error);
            });
        } else {
          res.statusCode = 400;
          res.send({ message: 'module not compatible with Oauth2 protocol' })
        }
      } else {
        res.statusCode = 404;
        res.send({ message: 'module not found' })
      }
    }
  }
}
