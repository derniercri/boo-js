'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _Module = require('./../../sdk/Module');

var _clientOauth = require('client-oauth2');

var _clientOauth2 = _interopRequireDefault(_clientOauth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain) {
  return {
    getAuthorizationCode: function getAuthorizationCode(req, res) {
      var item = brain.getModule(req.params.id);

      if (item != null) {
        var configuration = item.configuration;

        var clientIdField = configuration.fields.find(function (configField) {
          return configField.name == 'clientId';
        });

        var clientSecretField = configuration.fields.find(function (configField) {
          return configField.name == 'clientSecret';
        });

        var tokenField = configuration.fields.find(function (configField) {
          return configField.name == 'token';
        });

        var redirectField = configuration.fields.find(function (configField) {
          return configField.name == 'redirectUri';
        });

        var tokenUrlField = configuration.fields.find(function (configField) {
          return configField.name == 'tokenUrl';
        });

        if (clientIdField != null && clientSecretField != null && tokenField != null && redirectField != null && tokenUrlField != null) {

          var credentials = {
            client: {
              id: clientIdField.value,
              secret: clientSecretField.value
            },
            auth: {
              tokenHost: tokenUrlField.value,
              tokenPath: tokenUrlField.value
            }
          };

          var tokenConfig = {
            code: req.query.code,
            redirect_uri: redirectField.value
          };

          // Initialize the OAuth2 Library
          var oauth2 = require('simple-oauth2').create(credentials);
          oauth2.authorizationCode.getToken(tokenConfig).then(function (result) {
            console.log('received token');
            console.log(result);
            var token = oauth2.accessToken.create(result);

            if (tokenField != null && item != null) {
              tokenField.value = result;
              brain.updateConfigurationFields(item.id, [tokenField]);
            }

            if (req.body != null && typeof req.body.enabled === 'boolean') {
              if (req.body.enabled) {
                brain.setEnabled(req.params.id, req.body.enabled);
              }
              res.send(item);
              return;
            } else {
              res.statusCode = 400;
              res.send({ message: 'invalid request' });
            }
          }).catch(function (error) {
            res.statusCode = 500;
            res.send(error);
          });
        } else {
          res.statusCode = 400;
          res.send({ message: 'module not compatible with Oauth2 protocol' });
        }
      } else {
        res.statusCode = 404;
        res.send({ message: 'module not found' });
      }
    }
  };
};