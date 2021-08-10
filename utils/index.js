import { format, intervalToDuration, parse } from 'date-fns';
import {
  NUMERICAL_FULL_DATE_FORMAT,
  HUMAN_FULL_DATE_FORMAT,
  NUMERICAL_MONTH_YEAR_FORMAT,
  HUMAN_MONTH_YEAR_FORMAT,
  YEAR_ONLY_FORMAT,
} from '../consts';

export const convertToPixels = ({ years, months, days }, yearInPixels) =>
  years * yearInPixels +
  months * (yearInPixels / 12) +
  days * (yearInPixels / 365);

export const parseNumericalFullDate = date =>
  parse(date, NUMERICAL_FULL_DATE_FORMAT, new Date());
export const parseHumanFullDate = date =>
  parse(date, HUMAN_FULL_DATE_FORMAT, new Date());

export const parseNumericalMonthYearDate = date =>
  parse(date, NUMERICAL_MONTH_YEAR_FORMAT, new Date(0, 0, 1));
export const parseHumanMonthYearDate = date =>
  parse(date, HUMAN_MONTH_YEAR_FORMAT, new Date(0, 0, 1));

export const parseYearOnly = date =>
  parse(date, YEAR_ONLY_FORMAT, new Date(0, 1, 1));

export const parseNumericalAndHumanFullFormat = date =>
  date.includes('/') ? parseNumericalFullDate(date) : parseHumanFullDate(date);
export const parseNumericalAndHumanMonthYearFormat = date =>
  date.includes('/')
    ? parseNumericalMonthYearDate(date)
    : parseHumanMonthYearDate(date);

export const todayDate = () =>
  parseNumericalFullDate(format(new Date(), NUMERICAL_FULL_DATE_FORMAT));

export const parseMultipleFormat = date =>
  !date
    ? todayDate()
    : date.includes(' ') || date.includes('/')
    ? date.split(' ').length === 2 || date.split('/').length === 2
      ? parseNumericalAndHumanMonthYearFormat(date)
      : parseNumericalAndHumanFullFormat(date)
    : parseYearOnly(date);

export const convertToNumericalDate = humanDate =>
  humanDate.includes(' ')
    ? humanDate.split(' ').length === 2
      ? format(
          parseNumericalAndHumanMonthYearFormat(humanDate),
          NUMERICAL_MONTH_YEAR_FORMAT
        )
      : format(
          parseNumericalAndHumanFullFormat(humanDate),
          NUMERICAL_FULL_DATE_FORMAT
        )
    : humanDate;

export const convertToHumanDate = numericalDate =>
  numericalDate.includes('/')
    ? numericalDate.split('/').length === 2
      ? format(
          parseNumericalAndHumanMonthYearFormat(numericalDate),
          HUMAN_MONTH_YEAR_FORMAT
        )
      : format(
          parseNumericalAndHumanFullFormat(numericalDate),
          HUMAN_FULL_DATE_FORMAT
        )
    : numericalDate;

export const calculateStartDuration = (
  parsedMinStartDate,
  parsedStartDate,
  yearInPixels
) => {
  const startDuration = intervalToDuration({
    start: parsedMinStartDate,
    end: parsedStartDate,
  });

  return convertToPixels(startDuration, yearInPixels);
};

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
