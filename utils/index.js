import { format, intervalToDuration, isBefore, parse } from 'date-fns';
import {
  NUMERICAL_FULL_DATE_FORMAT,
  HUMAN_FULL_DATE_FORMAT,
  NUMERICAL_MONTH_YEAR_FORMAT,
  HUMAN_MONTH_YEAR_FORMAT,
  YEAR_ONLY_FORMAT,
} from '../consts';

export const convertToNumericalDate = humanDate =>
  humanDate.includes(' ')
    ? humanDate.split(' ').length === 2
      ? format(parseMonthYearOnlyFormat(humanDate), NUMERICAL_MONTH_YEAR_FORMAT)
      : format(parseFullFormat(humanDate), NUMERICAL_FULL_DATE_FORMAT)
    : humanDate;

export const convertToHumanDate = numericalDate =>
  numericalDate.includes('/')
    ? numericalDate.split('/').length === 2
      ? format(parseMonthYearOnlyFormat(numericalDate), HUMAN_MONTH_YEAR_FORMAT)
      : format(parseFullFormat(numericalDate), HUMAN_FULL_DATE_FORMAT)
    : numericalDate;

export const parseMultipleFormat = date =>
  !date
    ? todayDate()
    : isYearOnly(date)
    ? parseYearOnlyFormat(date)
    : isMonthYearOnly(date)
    ? parseMonthYearOnlyFormat(date)
    : parseFullFormat(date);

export const todayDate = () =>
  parseFullNumericalFormat(format(new Date(), NUMERICAL_FULL_DATE_FORMAT));

export const isYearOnly = dateString =>
  !dateString.includes(' ') && !dateString.includes('/');

export const parseYearOnlyFormat = dateString =>
  parse(dateString, YEAR_ONLY_FORMAT, new Date(0, 1, 1));

export const isMonthYearOnly = dateString =>
  dateString.split(' ').length === 2 || dateString.split('/').length === 2;

export const parseMonthYearOnlyFormat = dateString =>
  dateString.includes('/')
    ? parseMonthYearOnlyNumericalFormat(dateString)
    : parseMonthYearOnlyHumanFormat(dateString);
export const parseMonthYearOnlyNumericalFormat = dateString =>
  parse(dateString, NUMERICAL_MONTH_YEAR_FORMAT, new Date(0, 0, 1));
export const parseMonthYearOnlyHumanFormat = dateString =>
  parse(dateString, HUMAN_MONTH_YEAR_FORMAT, new Date(0, 0, 1));

export const parseFullFormat = dateString =>
  dateString.includes('/')
    ? parseFullNumericalFormat(dateString)
    : parseFullHumanFormat(dateString);
export const parseFullNumericalFormat = dateString =>
  parse(dateString, NUMERICAL_FULL_DATE_FORMAT, new Date());
export const parseFullHumanFormat = dateString =>
  parse(dateString, HUMAN_FULL_DATE_FORMAT, new Date());

export const convertToPixels = ({ years, months, days }, yearInPixels) =>
  years * yearInPixels +
  months * (yearInPixels / 12) +
  days * (yearInPixels / 365);

export const calculateDuration = (
  parsedStartDate,
  parsedEndDate,
  yearInPixels
) => {
  const duration = intervalToDuration({
    start: parsedStartDate,
    end: parsedEndDate,
  });

  return convertToPixels(duration, yearInPixels);
};

export const trimEventProperties = event =>
  Object.entries(event).reduce(
    (filteredEvent, [key, value]) => ({
      ...filteredEvent,
      [key]: typeof value === 'string' ? value.trim() : value,
    }),
    {}
  );

// Inspired by date-fns/eachYearOfInterval
// https://github.com/date-fns/date-fns/blob/4544f0cb1d724bfa7ee846b762bacb8fc303a961/src/eachYearOfInterval/index.js#L31
export const eachCenturyOfInterval = ({ start, end }) => {
  const currentDate = new Date(start);
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setMonth(0, 1);

  const currentYear = currentDate.getFullYear();
  currentDate.setFullYear(Math.ceil(currentYear / 100) * 100);

  const dates = [];
  while (isBefore(currentDate, end)) {
    dates.push(new Date(currentDate));

    currentDate.setFullYear(currentDate.getFullYear() + 100);
  }

  return dates;
};
