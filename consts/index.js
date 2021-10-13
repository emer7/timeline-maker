import colors from 'tailwindcss/colors';

export const FULL_NUMERICAL_FORMAT = 'd/M/yyyy';
export const FULL_NUMERICAL_ERA_FORMAT = 'd/M/yyyy G';
export const FULL_HUMAN_FORMAT = 'd MMMM yyyy';
export const FULL_HUMAN_ERA_FORMAT = 'd MMMM yyyy G';
export const FULL_US_FORMAT = 'MMMM d, yyyy';
export const FULL_US_ERA_FORMAT = 'MMMM d, yyyy G';

export const MONTH_YEAR_NUMERICAL_FORMAT = 'M/yyyy';
export const MONTH_YEAR_NUMERICAL_ERA_FORMAT = 'M/yyyy G';
export const MONTH_YEAR_HUMAN_FORMAT = 'MMMM yyyy';
export const MONTH_YEAR_HUMAN_ERA_FORMAT = 'MMMM yyyy G';

export const YEAR_ONLY_FORMAT = 'yyyy';
export const YEAR_ONLY_ERA_FORMAT = 'yyyy G';

export const WIDTH = 50;

export const SAMPLE_EVENT = {
  startDate: '02/04/748',
  endDate: '28/01/814',
  reignStartDate: '25/12/800',
  reignEndDate: '28/01/814',
  description: 'Charlemagne',
  type: 'people',
};

export const COLORS_NAME = [
  'black',
  'white',
  'coolGray',
  'red',
  'amber',
  'emerald',
  'blue',
];

export const WHITE = '#ffffff';
export const BLACK = '#000000';

export const PALETTE = Object.keys(colors)
  .filter(colorsKey => COLORS_NAME.includes(colorsKey))
  .sort(
    (colorsKeyA, colorsKeyB) =>
      COLORS_NAME.indexOf(colorsKeyA) - COLORS_NAME.indexOf(colorsKeyB)
  )
  .flatMap(colorsKey => {
    const colorsValue = colors[colorsKey];
    return typeof colorsValue === 'string'
      ? colorsValue
      : Object.keys(colorsValue)
          .filter(colorKey => ['300', '400', '500'].includes(colorKey))
          .map(colorKey => colorsValue[colorKey]);
  });

export const RELIGION_PALETTE = {
  undefined: colors.gray[300],
  Christian: colors.violet[400],
  Arianism: colors.indigo[500],
  Islam: colors.emerald[700],
  Hindu: colors.yellow[500],
  Buddha: colors.yellow[400],
};

export const RELIGION_OPTIONS = {
  '': 'Empty',
  Christian: 'Christian',
  Islam: 'Islam',
  Hindu: 'Hindu',
  Buddha: 'Buddha',
  Arianism: 'Arianism',
};

export const TYPE_OPTIONS = {
  event: 'Event',
  people: 'People',
};
