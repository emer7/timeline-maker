import React from 'react';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateDuration,
} from '../utils';

import { WIDTH, PALETTE, WHITE, RELIGION_PALETTE } from '../consts';

export const Bar = ({ minStartDate, ...props }) => {
  const {
    isShiftPressed,
    yearInPixels,
    event,
    position,
    temporaryVerticalPosition,
    canEventMove,
    canCreateGroup,
    isThrough,
    isOrigin,
    isDestination,
    isGroupSelection,
    isReligion,
    handleOnMouseDown,
    handleOnMouseUp,
    handleOnMouseLeave,
  } = props;

  const {
    startDate,
    endDate,
    description,
    reignStartDate,
    reignEndDate,
    color,
    religion,
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

  const cursorClassName = canEventMove
    ? 'cursor-move'
    : canCreateGroup && !isShiftPressed
    ? 'cursor-not-allowed'
    : 'cursor-pointer';
  const pointerEventsClassName = isThrough ? ' pointer-events-none' : '';
  const rectClassName = cursorClassName + pointerEventsClassName;
  const textClassName = `select-none ${rectClassName}`;

  const x = position - 25;
  const y = temporaryVerticalPosition || startDurationInPixels;

  return reignStartDate && reignEndDate ? (
    <WithReign
      startDurationInPixels={startDurationInPixels}
      durationInPixels={durationInPixels}
      {...props}
    >
      {description}
    </WithReign>
  ) : (
    <g>
      <rect
        className={rectClassName}
        x={x}
        y={y}
        height={Math.max(durationInPixels, 24)}
        width={WIDTH}
        fill={
          isReligion ? RELIGION_PALETTE[religion] : color ? color : PALETTE[16]
        }
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : color
            ? color
            : PALETTE[16]
        }
        strokeWidth={canEventMove ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <text
        className={textClassName}
        x={x + WIDTH / 2}
        y={y + Math.max(durationInPixels, 24) / 2}
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
  isShiftPressed,
  yearInPixels,
  event,
  position,
  temporaryVerticalPosition,
  canEventMove,
  canCreateGroup,
  isThrough,
  isOrigin,
  isDestination,
  isGroupSelection,
  isReligion,
  startDurationInPixels,
  durationInPixels,
  handleOnMouseDown,
  handleOnMouseUp,
  handleOnMouseLeave,
  children,
}) => {
  const { reignStartDate, reignEndDate, startDate, color, religion } = event;

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

  const cursorClassName = canEventMove
    ? 'cursor-move'
    : canCreateGroup && !isShiftPressed
    ? 'cursor-not-allowed'
    : 'cursor-pointer';
  const pointerEventsClassName = isThrough ? ' pointer-events-none' : '';
  const rectClassName = cursorClassName + pointerEventsClassName;
  const textClassName = `select-none ${rectClassName}`;

  const x = position - 25;
  const y = temporaryVerticalPosition || startDurationInPixels;

  return (
    <g>
      <rect
        className={rectClassName}
        x={x}
        y={y}
        height={Math.max(reignStartDurationInPixels, 0)}
        width={WIDTH}
        fill={WHITE}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <rect
        className={rectClassName}
        x={x}
        y={y + reignStartDurationInPixels}
        height={Math.max(reignDurationInPixels, 0)}
        width={WIDTH}
        fill={
          isReligion ? RELIGION_PALETTE[religion] : color ? color : PALETTE[10]
        }
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <rect
        className={rectClassName}
        x={x}
        y={y + reignStartDurationInPixels + reignDurationInPixels}
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
        className={textClassName}
        x={x + WIDTH / 2}
        y={y + Math.max(durationInPixels, 24) / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      >
        {children}
      </text>
      <rect
        className={pointerEventsClassName.trim()}
        x={x}
        y={y}
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
        strokeWidth={canEventMove ? 3 : 1}
      />
    </g>
  );
};
