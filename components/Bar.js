import React from 'react';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateStartDuration,
  calculateDuration,
} from '../utils';

import { WIDTH } from '../consts';

const YEAR_IN_PIXELS = 6;

export const Bar = ({ vw, event, minStartDate, position }) => {
  const { startDate, endDate, description, reignStartDate, reignEndDate } =
    event;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(startDate);
  const parsedEndDate = parseMultipleFormat(endDate);

  const durationInPixels = calculateDuration(
    parsedStartDate,
    parsedEndDate,
    YEAR_IN_PIXELS
  );

  const startDurationInPixels = calculateStartDuration(
    parsedMinStartDate,
    parsedStartDate,
    YEAR_IN_PIXELS
  );

  return reignStartDate && reignEndDate ? (
    <WithReign
      vw={vw}
      event={event}
      position={position}
      startDurationInPixels={startDurationInPixels}
      durationInPixels={durationInPixels}
    >
      {description}
    </WithReign>
  ) : (
    <g>
      <rect
        className="cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={startDurationInPixels}
        height={Math.max(durationInPixels, 24)}
        width={WIDTH}
        fill="#14213d"
        stroke="#14213d"
        strokeWidth={1}
      />
      <text
        className="select-none cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25) + WIDTH / 2}
        y={startDurationInPixels + Math.max(durationInPixels, 24) / 2}
        fill="#e5e5e5"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {description}
      </text>
    </g>
  );
};

export const WithReign = ({
  vw,
  event,
  position,
  startDurationInPixels,
  durationInPixels,
  children,
}) => {
  const { reignStartDate, reignEndDate, startDate } = event;

  const parsedReignStartDate = parseMultipleFormat(reignStartDate);
  const parsedReignEndDate = parseMultipleFormat(reignEndDate);
  const parsedStartDate = parseMultipleFormat(startDate);

  const reignDurationInPixels = calculateDuration(
    parsedReignStartDate,
    parsedReignEndDate,
    YEAR_IN_PIXELS
  );

  const reignStartDurationInPixels = calculateStartDuration(
    parsedStartDate,
    parsedReignStartDate,
    YEAR_IN_PIXELS
  );

  return (
    <g>
      <rect
        className="cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={startDurationInPixels}
        height={reignStartDurationInPixels}
        width={WIDTH}
        fill="#ffffff"
        stroke="#fca311"
        strokeWidth={1}
      />
      <rect
        className="cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={startDurationInPixels + reignStartDurationInPixels}
        height={reignDurationInPixels}
        width={WIDTH}
        fill="#fca311"
        stroke="#fca311"
        strokeWidth={1}
      />
      <rect
        className="cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={
          startDurationInPixels +
          reignStartDurationInPixels +
          reignDurationInPixels
        }
        height={
          startDurationInPixels +
          durationInPixels -
          (startDurationInPixels +
            reignStartDurationInPixels +
            reignDurationInPixels)
        }
        width={WIDTH}
        fill="#ffffff"
        stroke="#fca311"
        strokeWidth={1}
      />
      <text
        className="select-none cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25) + WIDTH / 2}
        y={startDurationInPixels + Math.max(durationInPixels, 24) / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {children}
      </text>
    </g>
  );
};
