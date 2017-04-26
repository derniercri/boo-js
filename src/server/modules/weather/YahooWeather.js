// @flow

import {
  Info,
  Sdk,
  Component,
  Configuration,
  ConfigurationField,
  Weather
} from './../../../sdk';
import weather from 'yahoo-weather';
import moment from 'moment';

type Conditions = {astronomy: {sunrise: string, sunset: string}, item: {condition: {temp: string, code: number, text: string}}};

export default class YahooWeather {
  getId(): string {
    return "80ad2b23-69c7-47c8-88e8-387c4345cbe5";
  }

  getInfo(): Info {
    return new Info(
      this.getId(),
      "Weather",
      "Weather from Yahoo",
      new Configuration(
        [
          new ConfigurationField("location", "", "string", "Location of the weather"),
        ]
      ),
    )
  }

  onStart(sdk: Sdk, config: Configuration) {
    let locationField = config.get('location');

    if (locationField != null && locationField.value != '' && locationField.value != null) {
      this.update(sdk, locationField.value);
    } else {
      sdk.notifyConfigurationError('location not set');
    }
  }

  update(sdk: Sdk, location: string) {
    let self = this;

    weather(location).then((info: ?Conditions) => {
      if (info != null) {
        let weather = new Weather('yahoo', 'Yahoo Weather');
        weather.set(
          parseTime(info.astronomy.sunset),
          parseTime(info.astronomy.sunrise),
          parseInt(info.item.condition.temp),
          info.item.condition.code,
          info.item.condition.text,
        );

        sdk.addComponent(weather);

        setTimeout(function () { self.update(sdk, location) }, 60 * 60 * 1000); //Update in 1 hour
      } else {
        setTimeout(function () { self.update(sdk, location) }, 500);
      }
    }).catch((err) => {
      sdk.notifyConfigurationError(err)
      sdk.error(err);
    });
  }

  onComponentChange(component: Component) {
  }

  onConfigurationUpdate(configuration: Configuration) {
  }

  onStop() {

  }
}

export function parseTime(time: string): moment {
  return moment(time, 'h:mm a');
}
