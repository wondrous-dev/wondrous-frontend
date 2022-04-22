import locale from 'date-fns/locale/en-US';
import { formatDistanceStrict } from 'date-fns';

/**
 *
 * helper to get shorted timelapse
 * e.g 1 minute ago -> 1m
 */

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}m',
  xMinutes: '{{count}}m',
  aboutXHours: '{{count}}h',
  xHours: '{{count}}h',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}w',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}y',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}y',
};

function formatDistance(token, count) {
  const result = formatDistanceLocale[token].replace('{{count}}', count);
  return result;
}

export default function calculateTimeLapse(timestamp) {
  return formatDistanceStrict(new Date(timestamp), new Date(), {
    locale: {
      ...locale,
      formatDistance,
    },
  });
}
