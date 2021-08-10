import React from 'react';
import { Delete as DeleteIcon } from '@material-ui/icons';

import {
  calculateStartDuration,
  convertToHumanDate,
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
  handleDeleteEvent,
}) => {
  const { description, startDate, endDate, reignStartDate, reignEndDate } =
    selectedEvent;

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
      <DeleteIcon
        className="float-right cursor-pointer"
        onClick={handleDeleteEvent}
      />
      <div className="mb-2 font-bold clear-right">{description}</div>
      <div>
        Start date: <br />
        {convertToHumanDate(startDate)}
      </div>
      {endDate && (
        <div>
          End date: <br />
          {convertToHumanDate(endDate)}
        </div>
      )}
      {reignStartDate && (
        <div>
          Reign start date: <br />
          {convertToHumanDate(reignStartDate)}
        </div>
      )}
      {reignEndDate && (
        <div>
          Reign end date: <br />
          {convertToHumanDate(reignEndDate)}
        </div>
      )}
    </div>
  );
};
