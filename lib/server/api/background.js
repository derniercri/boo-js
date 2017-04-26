'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Brain = require('./../brain/Brain');

var _Brain2 = _interopRequireDefault(_Brain);

var _sdk = require('./../../sdk');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _flickrSdk = require('flickr-sdk');

var _flickrSdk2 = _interopRequireDefault(_flickrSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (brain) {
  return {
    getBackground: function getBackground(req, res) {
      var weather = brain.getComponents().find(function (item) {
        if (item instanceof _sdk.Weather) {
          return item;
        }
      });

      if (weather instanceof _sdk.Weather) {
        var flickr = new _flickrSdk2.default({
          "apiKey": "dc91f6d2ae5b6c6548b6eef0f2f70cd2",
          "apiSecret": "570216107091ee65"
        });

        flickr.request().media().search(weather.values.text + " background").get({
          media: 'photos',
          sort: 'date-taken-desc',
          safe_search: 3,
          accuracy: 'region'
        }).then(function (response) {
          flickr.request().media(response.body.photos.photo[0].id).get().then(function (response) {
            var photo = response.body.photo;
            var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_h.jpg';

            _request2.default.get(url).pipe(res);
          });
        }).catch(function (err) {
          console.log(err);
        });
      }
    }
  };
};