import colors from 'tailwindcss/colors';

export const NUMERICAL_FULL_DATE_FORMAT = 'd/M/yyyy';
export const HUMAN_FULL_DATE_FORMAT = 'd MMMM yyyy';

export const NUMERICAL_MONTH_YEAR_FORMAT = 'M/yyyy';
export const HUMAN_MONTH_YEAR_FORMAT = 'MMMM yyyy';

export const YEAR_ONLY_FORMAT = 'yyyy';

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
};

export const TYPE_OPTIONS = {
  event: 'Event',
  people: 'People',
};
