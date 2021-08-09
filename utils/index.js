import { format, parse } from 'date-fns';
import {
  NUMERICAL_FULL_DATE_FORMAT,
  HUMAN_FULL_DATE_FORMAT,
  NUMERICAL_MONTH_YEAR_FORMAT,
  HUMAN_MONTH_YEAR_FORMAT,
} from '../consts';

export const parseNumericalFullDate = date =>
  parse(date, NUMERICAL_FULL_DATE_FORMAT, new Date());
export const parseHumanFullDate = date =>
  parse(date, HUMAN_FULL_DATE_FORMAT, new Date());

export const parseNumericalMonthYearDate = date =>
  parse(date, NUMERICAL_MONTH_YEAR_FORMAT, new Date(0, 0, 1));
export const parseHumanMonthYearDate = date =>
  parse(date, HUMAN_MONTH_YEAR_FORMAT, new Date(0, 0, 1));

export const parseNumericalAndHumanFullFormat = date =>
  date.includes('/') ? parseNumericalFullDate(date) : parseHumanFullDate(date);
export const parseNumericalAndHumanMonthYearFormat = date =>
  date.includes('/')
    ? parseNumericalMonthYearDate(date)
    : parseHumanMonthYearDate(date);

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
