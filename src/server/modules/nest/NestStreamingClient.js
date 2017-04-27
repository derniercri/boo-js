// @flow

//import * as firebase from 'firebase';
import Firebase from 'firebase';
import { Sdk } from './../../../sdk';
var authToken = 'some_long_auth_token';

type StreamType = (Array<Object>) => void;

export default class NestStreamingClient {
  token: Object;
  sdk: Sdk;

  constructor(token: Object, sdk: Sdk) {
    this.token = token;
    this.sdk = sdk;
  }

  stream(cb: StreamType) {
    let self = this;
    if (this.token != null) {
      var client = new Firebase('wss://developer-api.nest.com');

      //Authenticating firebase client by using access token
      client.authWithCustomToken(this.token.access_token, function (error) {
        if (error) {
          self.sdk.error('Error in connecting Firebase Socket: ' + error)
        } else {
          self.sdk.debug('Firebase socket is connected.')
        }
      });

      //Now we can listen any changes in Nest Devices
      client.on('value', (snapshot) => {
        var obj = snapshot.val();
        var nestDevices = obj.devices; //Getting All Nest Devices
        cb(nestDevices);
      })
    }
  }
}
