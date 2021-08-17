import React from 'react';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateDuration,
} from '../utils';

import { WIDTH, PALETTE, WHITE } from '../consts';

export const Bar = ({
  yearInPixels,
  vw,
  event,
  minStartDate,
  position,
  temporaryVerticalPosition,
  canMove,
  isThrough,
  isOrigin,
  isDestination,
  isGroupSelection,
  handleOnMouseDown,
  handleOnMouseUp,
  handleOnMouseLeave,
}) => {
  const {
    startDate,
    endDate,
    description,
    reignStartDate,
    reignEndDate,
    color,
  } = event;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(startDate);
  const parsedEndDate = parseMultipleFormat(endDate);

  const durationInPixels = calculateDuration(
    parsedStartDate,
    parsedEndDate,
    yearInPixels
  );

  const startDurationInPixels = calculateDuration(
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
      canMove={canMove}
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
        fill={color ? color : PALETTE[4]}
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : color
            ? color
            : PALETTE[4]
        }
        strokeWidth={canMove ? 3 : 1}
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
  canMove,
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
  const { reignStartDate, reignEndDate, startDate, color } = event;

  const parsedReignStartDate = parseMultipleFormat(reignStartDate);
  const parsedReignEndDate = parseMultipleFormat(reignEndDate);
  const parsedStartDate = parseMultipleFormat(startDate);

  const reignDurationInPixels = calculateDuration(
    parsedReignStartDate,
    parsedReignEndDate,
    yearInPixels
  );

  const reignStartDurationInPixels = calculateDuration(
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
        fill={WHITE}
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
        fill={color ? color : PALETTE[10]}
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
        fill={WHITE}
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
      <rect
        className={isThrough ? 'pointer-events-none' : ''}
        x={Math.max(0, Math.min(vw - 25, position) - 25)}
        y={temporaryVerticalPosition || startDurationInPixels}
        height={Math.max(durationInPixels, 0)}
        width={WIDTH}
        fill="none"
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : color
            ? color
            : PALETTE[10]
        }
        strokeWidth={canMove ? 3 : 1}
      />
    </g>
  );
};
