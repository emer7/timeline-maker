import React from 'react';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateStartDuration,
  calculateDuration,
} from '../utils';

import { WIDTH } from '../consts';

export const Bar = ({
  yearInPixels,
  vw,
  event,
  minStartDate,
  position,
  temporaryVerticalPosition,
  isHold,
  isThrough,
  isOrigin,
  isDestination,
  isGroupSelection,
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
    yearInPixels
  );

  const startDurationInPixels = calculateStartDuration(
    parsedMinStartDate,
    parsedStartDate,
    yearInPixels
  );

  return reignStartDate && reignEndDate ? (
    <WithReign
      yearInPixels={yearInPixels}
      vw={vw}
      event={event}
      position={position}
      temporaryVerticalPosition={temporaryVerticalPosition}
      isHold={isHold}
      isThrough={isThrough}
      isOrigin={isOrigin}
      isDestination={isDestination}
      isGroupSelection={isGroupSelection}
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
        className={`cursor-pointer${isThrough ? ' pointer-events-none' : ''}`}
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={temporaryVerticalPosition || startDurationInPixels}
        height={Math.max(durationInPixels, 24)}
        width={WIDTH}
        fill="#14213d"
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : '#14213d'
        }
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <text
        className={`select-none cursor-pointer${
          isThrough ? ' pointer-events-none' : ''
        }`}
        x={Math.max(0, Math.min(vw - 25, position) - 25) + WIDTH / 2}
        y={
          (temporaryVerticalPosition || startDurationInPixels) +
          Math.max(durationInPixels, 24) / 2
        }
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
  yearInPixels,
  vw,
  event,
  position,
  temporaryVerticalPosition,
  isHold,
  isThrough,
  isOrigin,
  isDestination,
  isGroupSelection,
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
    yearInPixels
  );

  const reignStartDurationInPixels = calculateStartDuration(
    parsedStartDate,
    parsedReignStartDate,
    yearInPixels
  );

  return (
    <g>
      <rect
        className={`cursor-pointer${isThrough ? ' pointer-events-none' : ''}`}
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={temporaryVerticalPosition || startDurationInPixels}
        height={Math.max(reignStartDurationInPixels, 0)}
        width={WIDTH}
        fill="#ffffff"
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : '#fca311'
        }
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <rect
        className={`cursor-pointer${isThrough ? ' pointer-events-none' : ''}`}
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={
          (temporaryVerticalPosition || startDurationInPixels) +
          reignStartDurationInPixels
        }
        height={Math.max(reignDurationInPixels, 0)}
        width={WIDTH}
        fill="#fca311"
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : '#fca311'
        }
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <rect
        className={`cursor-pointer${isThrough ? ' pointer-events-none' : ''}`}
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={
          (temporaryVerticalPosition || startDurationInPixels) +
          reignStartDurationInPixels +
          reignDurationInPixels
        }
        height={Math.max(
          startDurationInPixels +
            durationInPixels -
            (startDurationInPixels +
              reignStartDurationInPixels +
              reignDurationInPixels),
          0
        )}
        width={WIDTH}
        fill="#ffffff"
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : '#fca311'
        }
        strokeWidth={isHold ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <text
        className={`select-none cursor-pointer${
          isThrough ? ' pointer-events-none' : ''
        }`}
        x={Math.max(0, Math.min(vw - 25, position) - 25) + WIDTH / 2}
        y={
          (temporaryVerticalPosition || startDurationInPixels) +
          Math.max(durationInPixels, 24) / 2
        }
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
