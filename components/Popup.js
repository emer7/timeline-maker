import React from 'react';

import {
  calculateStartDuration,
  parseMultipleFormat,
  parseNumericalFullDate,
} from '../utils';
import { WIDTH } from '../consts';

export const Popup = ({
  scrollTop,
  yearInPixels,
  minStartDate,
  selectedEvent,
  left,
}) => {
  const { startDate } = selectedEvent;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(startDate);

  const top = calculateStartDuration(
    parsedMinStartDate,
    parsedStartDate,
    yearInPixels
  );

  return (
    <div
      className="relative inline-block p-2 rounded-r-lg shadow bg-white"
      style={{ top: top - scrollTop, left: Math.max(WIDTH, left + WIDTH / 2) }}
    >
      Popup
    </div>
  );
};
