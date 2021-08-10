import React from 'react';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateStartDuration,
  calculateDuration,
} from '../utils';

import { WIDTH } from '../consts';

const YEAR_IN_PIXELS = 6;

export const Bar = ({
  vw,
  event,
  minStartDate,
  position,
  isHold,
  handleOnMouseDown,
  handleOnMouseUp,
  handleOnMouseLeave,
}) => {
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
      isHold={isHold}
      startDurationInPixels={startDurationInPixels}
      durationInPixels={durationInPixels}
      handleOnMouseDown={handleOnMouseDown}
      handleOnMouseUp={handleOnMouseUp}
      handleOnMouseLeave={handleOnMouseLeave}
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
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <text
        className="select-none cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25) + WIDTH / 2}
        y={startDurationInPixels + Math.max(durationInPixels, 24) / 2}
        fill="#e5e5e5"
        textAnchor="middle"
        alignmentBaseline="middle"
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
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
  isHold,
  startDurationInPixels,
  durationInPixels,
  handleOnMouseDown,
  handleOnMouseUp,
  handleOnMouseLeave,
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
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <rect
        className="cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={startDurationInPixels + reignStartDurationInPixels}
        height={reignDurationInPixels}
        width={WIDTH}
        fill="#fca311"
        stroke="#fca311"
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
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
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <text
        className="select-none cursor-pointer"
        x={Math.max(0, Math.min(vw - 25, position) - 25) + WIDTH / 2}
        y={startDurationInPixels + Math.max(durationInPixels, 24) / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      >
        {children}
      </text>
    </g>
  );
};
