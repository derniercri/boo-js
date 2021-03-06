import EventManager, { getTime } from './../../../src/server/brain/EventManager';
import ComponentManager from './../../../src/server/brain/memory/ComponentManager';
import { TimeChangeEvent } from './../../../src/sdk/Event';
import { Weather } from './../../../src/sdk/Component';
import winston from 'winston';
import Moment from 'moment';

test('test Sunrise and Sunset', () => {
  const componentManager = new ComponentManager();
  const eventManager = new EventManager(componentManager, winston);
  const weather = new Weather('testweather', 'Test weather');
  weather.values.sunrise = Moment('2014-02-27T10:00:00').unix();
  weather.values.sunset = Moment('2014-02-27T22:00:00').unix();
  componentManager.addOrUpdate(weather);

  expect(eventManager.state.sunset).toBe(null);

  eventManager.handle(new TimeChangeEvent(new Moment('2014-02-27T11:00:00')), []);
  expect(eventManager.state.sunset).toBe(0);


  eventManager.handle(new TimeChangeEvent(new Moment('2014-02-27T23:00:00')), []);
  expect(eventManager.state.sunset).toBe(1);

  // Change day
  weather.values.sunrise = Moment('2014-03-27T10:00:00').unix();
  weather.values.sunset = Moment('2014-03-27T22:00:00').unix();
  eventManager.handle(new TimeChangeEvent(new Moment('2014-02-27T23:00:00')), []);
  expect(eventManager.state.sunset).toBe(1)
});
