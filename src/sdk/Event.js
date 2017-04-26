// @flow

import Moment from 'moment';

export const TIME_CHANGE = 'TIME_CHANGE';

export class Event {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
}


export class TimeChangeEvent extends Event {
  time: Moment;

  constructor(time: Moment) {
    super(TIME_CHANGE);
    this.time = time;
  }
}
