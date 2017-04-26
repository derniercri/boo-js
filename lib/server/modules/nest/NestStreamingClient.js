'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

//import * as firebase from 'firebase';


var _firebase = require('firebase');

var _firebase2 = _interopRequireDefault(_firebase);

var _sdk = require('./../../../sdk');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var authToken = 'some_long_auth_token';

var NestStreamingClient = function () {
  function NestStreamingClient(token, sdk) {
    _classCallCheck(this, NestStreamingClient);

    this.token = token;
    this.sdk = sdk;
  }

  _createClass(NestStreamingClient, [{
    key: 'stream',
    value: function stream(cb) {
      var self = this;
      if (this.token != null) {
        var client = new _firebase2.default('wss://developer-api.nest.com');

        //Authenticating firebase client by using access token
        client.authWithCustomToken(this.token.access_token, function (error) {
          if (error) {
            self.sdk.error('Error in connecting Firebase Socket: ' + error);
          } else {
            self.sdk.debug('Firebase socket is connected.');
          }
        });

        //Now we can listen any changes in Nest Devices
        client.on('value', function (snapshot) {
          var obj = snapshot.val();
          var nestDevices = obj.devices; //Getting All Nest Devices
          cb(nestDevices);
        });
      }
    }
  }]);

  return NestStreamingClient;
}();

exports.default = NestStreamingClient;