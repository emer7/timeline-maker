import { format, intervalToDuration, isBefore, parse } from 'date-fns';
import {
  FULL_NUMERICAL_FORMAT,
  FULL_NUMERICAL_ERA_FORMAT,
  FULL_HUMAN_FORMAT,
  FULL_HUMAN_ERA_FORMAT,
  FULL_US_FORMAT,
  FULL_US_ERA_FORMAT,
  MONTH_YEAR_NUMERICAL_FORMAT,
  MONTH_YEAR_NUMERICAL_ERA_FORMAT,
  MONTH_YEAR_HUMAN_FORMAT,
  MONTH_YEAR_HUMAN_ERA_FORMAT,
  YEAR_ONLY_FORMAT,
  YEAR_ONLY_ERA_FORMAT,
} from '../consts';

export const convertToNumericalDate = humanDate =>
  !humanDate.includes(' ')
    ? humanDate
    : isEraIncluded(humanDate)
    ? convertToNumericalDateFromWithEra(humanDate)
    : convertToNumericalDateFromWithoutEra(humanDate);

export const convertToNumericalDateFromWithEra = humanDate =>
  isAmericanFullFormat(humanDate)
    ? format(parseAmericanFullEraFormat(humanDate), FULL_NUMERICAL_ERA_FORMAT)
    : isYearOnlyEraFormat(humanDate)
    ? format(parseYearOnlyEraFormat(humanDate), YEAR_ONLY_ERA_FORMAT)
    : isMonthYearOnlyEraFormat(humanDate)
    ? format(
        parseMonthYearOnlyEraFormat(humanDate),
        MONTH_YEAR_NUMERICAL_ERA_FORMAT
      )
    : format(parseFullEraFormat(humanDate), FULL_NUMERICAL_ERA_FORMAT);

export const convertToNumericalDateFromWithoutEra = humanDate =>
  isAmericanFullFormat(humanDate)
    ? format(parseAmericanFullFormat(humanDate), FULL_NUMERICAL_FORMAT)
    : isMonthYearOnlyFormat(humanDate)
    ? format(parseMonthYearOnlyFormat(humanDate), MONTH_YEAR_NUMERICAL_FORMAT)
    : format(parseFullFormat(humanDate), FULL_NUMERICAL_FORMAT);

export const convertToHumanDate = numericalDate =>
  !numericalDate.includes('/')
    ? numericalDate
    : isEraIncluded(numericalDate)
    ? convertToHumanDateFromWithEra(numericalDate)
    : convertToHumanDateFromWithoutEra(numericalDate);

export const convertToHumanDateFromWithEra = numericalDate =>
  isMonthYearOnlyEraFormat(numericalDate)
    ? format(
        parseMonthYearOnlyEraFormat(numericalDate),
        MONTH_YEAR_HUMAN_ERA_FORMAT
      )
    : format(parseFullEraFormat(numericalDate), FULL_HUMAN_ERA_FORMAT);
export const convertToHumanDateFromWithoutEra = numericalDate =>
  isMonthYearOnlyFormat(numericalDate)
    ? format(parseMonthYearOnlyFormat(numericalDate), MONTH_YEAR_HUMAN_FORMAT)
    : format(parseFullFormat(numericalDate), FULL_HUMAN_FORMAT);

export const parseMultipleFormat = dateString =>
  !dateString
    ? todayDate()
    : isEraIncluded(dateString)
    ? parseEraIncluded(dateString)
    : parseEraNotIncluded(dateString);

export const todayDate = () =>
  parseFullNumericalFormat(format(new Date(), FULL_NUMERICAL_FORMAT));

export const isEraIncluded = dateString => {
  const lastToken = dateString.split(' ').slice(-1)[0];

  return lastToken === 'AD' || lastToken === 'BC';
};

export const parseEraIncluded = dateString =>
  isAmericanFullFormat(dateString)
    ? parseAmericanFullEraFormat(dateString)
    : isYearOnlyEraFormat(dateString)
    ? parseYearOnlyEraFormat(dateString)
    : isMonthYearOnlyEraFormat(dateString)
    ? parseMonthYearOnlyEraFormat(dateString)
    : parseFullEraFormat(dateString);

export const isAmericanFullFormat = dateString => dateString.includes(',');

export const parseAmericanFullEraFormat = dateString =>
  parse(dateString, FULL_US_ERA_FORMAT, new Date());

export const isYearOnlyEraFormat = dateString =>
  dateString.split(' ').length === 2 && !dateString.includes('/');

export const parseYearOnlyEraFormat = dateString =>
  parse(dateString, YEAR_ONLY_ERA_FORMAT, new Date(0, 1, 1));

export const isMonthYearOnlyEraFormat = dateString =>
  dateString.split(' ').length === 3 || dateString.split('/').length === 2;

export const parseMonthYearOnlyEraFormat = dateString =>
  dateString.includes('/')
    ? parseMonthYearOnlyNumericalEraFormat(dateString)
    : parseMonthYearOnlyHumanEraFormat(dateString);
export const parseMonthYearOnlyNumericalEraFormat = dateString =>
  parse(dateString, MONTH_YEAR_NUMERICAL_ERA_FORMAT, new Date(0, 0, 1));
export const parseMonthYearOnlyHumanEraFormat = dateString =>
  parse(dateString, MONTH_YEAR_HUMAN_ERA_FORMAT, new Date(0, 0, 1));

export const parseFullEraFormat = dateString =>
  dateString.includes('/')
    ? parseFullNumericalEraFormat(dateString)
    : parseFullHumanEraFormat(dateString);
export const parseFullNumericalEraFormat = dateString =>
  parse(dateString, FULL_NUMERICAL_ERA_FORMAT, new Date());
export const parseFullHumanEraFormat = dateString =>
  parse(dateString, FULL_HUMAN_ERA_FORMAT, new Date());

export const parseEraNotIncluded = dateString =>
  isAmericanFullFormat(dateString)
    ? parseAmericanFullFormat(dateString)
    : isYearOnlyFormat(dateString)
    ? parseYearOnlyFormat(dateString)
    : isMonthYearOnlyFormat(dateString)
    ? parseMonthYearOnlyFormat(dateString)
    : parseFullFormat(dateString);

export const parseAmericanFullFormat = dateString =>
  parse(dateString, FULL_US_FORMAT, new Date());

export const isYearOnlyFormat = dateString =>
  !dateString.includes(' ') && !dateString.includes('/');

export const parseYearOnlyFormat = dateString =>
  parse(dateString, YEAR_ONLY_FORMAT, new Date(0, 1, 1));

export const isMonthYearOnlyFormat = dateString =>
  dateString.split(' ').length === 2 || dateString.split('/').length === 2;

export const parseMonthYearOnlyFormat = dateString =>
  dateString.includes('/')
    ? parseMonthYearOnlyNumericalFormat(dateString)
    : parseMonthYearOnlyHumanFormat(dateString);
export const parseMonthYearOnlyNumericalFormat = dateString =>
  parse(dateString, MONTH_YEAR_NUMERICAL_FORMAT, new Date(0, 0, 1));
export const parseMonthYearOnlyHumanFormat = dateString =>
  parse(dateString, MONTH_YEAR_HUMAN_FORMAT, new Date(0, 0, 1));

export const parseFullFormat = dateString =>
  dateString.includes('/')
    ? parseFullNumericalFormat(dateString)
    : parseFullHumanFormat(dateString);
export const parseFullNumericalFormat = dateString =>
  parse(dateString, FULL_NUMERICAL_FORMAT, new Date());
export const parseFullHumanFormat = dateString =>
  parse(dateString, FULL_HUMAN_FORMAT, new Date());

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
