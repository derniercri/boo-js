import { parseTime } from './YahooWeather';
import moment from 'moment';

test('test Time parsing', () => {
  const time = parseTime('6:15 pm');
  const now = moment();
  expect(time.format('MM DD YY')).toBe(now.format('MM DD YY'));
  expect(time.format('HH:mm:ss')).toBe('18:15:00')
});
