import { parseTime } from './YahooWeather';
import moment from 'moment';

test('test Time parsing', () => {
  const time = parseTime('3:15 pm');
  const now = moment();
  expect(time.format('MM DD YY')).toBe(now.format('MM DD YY'));
});
