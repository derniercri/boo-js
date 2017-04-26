import Brain from './../brain/Brain';
import { Weather } from './../../sdk';
import request from 'request';
import Flickr from 'flickr-sdk';
import type { $Request, $Response } from 'express';

export default (brain: Brain) => {
  return {
    getBackground: (req: $Request, res: $Response) => {
      let weather = brain.getComponents().find((item) => {
        if (item instanceof Weather) { return item }
      });

      if (weather instanceof Weather) {
        var flickr = new Flickr({
          "apiKey": "dc91f6d2ae5b6c6548b6eef0f2f70cd2",
          "apiSecret": "570216107091ee65"
        });

        flickr
          .request()
          .media()
          .search(weather.values.text + " background")
          .get({
            media: 'photos',
            sort: 'date-taken-desc',
            safe_search: 3,
            accuracy: 'region'
          })
          .then((response) => {
            flickr
              .request()
              .media(response.body.photos.photo[0].id)
              .get()
              .then(function (response) {
                let photo = response.body.photo;
                let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_h.jpg`;

                request.get(url).pipe(res);
              });
          }).catch((err) => {
            console.log(err);
          });
      }
    }
  }
}
