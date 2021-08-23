import React from 'react';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateDuration,
} from '../utils';
import { getFontWhiteOrBlack } from '../utils/color';

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

  let durationInPixels;
  let startDurationInPixels;
  try {
    durationInPixels = Math.max(
      24,
      calculateDuration(parsedStartDate, parsedEndDate, yearInPixels)
    );

    startDurationInPixels = calculateDuration(
      parsedMinStartDate,
      parsedStartDate,
      yearInPixels
    );
  } catch {
    durationInPixels = 0;
    startDurationInPixels = 0;
  }

  const cursorClassName = canEventMove
    ? 'cursor-move'
    : canCreateGroup && !isShiftPressed
    ? 'cursor-not-allowed'
    : 'cursor-pointer';
  const pointerEventsNoneClassName = isThrough ? 'pointer-events-none' : '';
  const rectClassName = `${cursorClassName} ${pointerEventsNoneClassName}`;
  const textClassName = `${rectClassName} select-none`;

  const x = position - 25;
  const y = temporaryVerticalPosition || startDurationInPixels;
  const fill = isReligion ? RELIGION_PALETTE[religion] : color ?? PALETTE[16];

  return reignStartDate && reignEndDate ? (
    <WithReign startDurationInPixels={startDurationInPixels} {...props}>
      {description}
    </WithReign>
  ) : (
    <g>
      <rect
        className={rectClassName}
        x={x}
        y={y}
        height={durationInPixels}
        width={WIDTH}
        fill={fill}
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
        style={{ clipPath: 'inset(0px calc(50% - 18px))' }}
        x={x + WIDTH / 2}
        y={y + durationInPixels / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill={getFontWhiteOrBlack(fill)}
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
  handleOnMouseDown,
  handleOnMouseUp,
  handleOnMouseLeave,
  children,
}) => {
  const { reignStartDate, reignEndDate, startDate, endDate, color, religion } =
    event;

  const parsedReignStartDate = parseMultipleFormat(reignStartDate);
  const parsedReignEndDate = parseMultipleFormat(reignEndDate);
  const parsedStartDate = parseMultipleFormat(startDate);
  const parsedEndDate = parseMultipleFormat(endDate);

  let reignDurationInPixels;
  let reignStartDurationInPixels;
  let postReignDurationInPixels;
  let durationInPixels;
  try {
    const calculatedReignDurationInPixels = calculateDuration(
      parsedReignStartDate,
      parsedReignEndDate,
      yearInPixels
    );
    const calculatedReignStartDurationInPixels = calculateDuration(
      parsedStartDate,
      parsedReignStartDate,
      yearInPixels
    );
    const calculatedPostReignDurationInPixels = calculateDuration(
      parsedReignEndDate,
      parsedEndDate,
      yearInPixels
    );
    const calculatedDurationInPixels =
      calculatedReignStartDurationInPixels +
      calculatedReignDurationInPixels +
      calculatedPostReignDurationInPixels;

    reignDurationInPixels = Math.max(
      (calculatedReignDurationInPixels / calculatedDurationInPixels) * 24,
      calculatedReignDurationInPixels
    );
    reignStartDurationInPixels = Math.max(
      (calculatedReignStartDurationInPixels / calculatedDurationInPixels) * 24,
      calculatedReignStartDurationInPixels
    );
    postReignDurationInPixels = Math.max(
      (calculatedPostReignDurationInPixels / calculatedDurationInPixels) * 24,
      calculatedPostReignDurationInPixels
    );
    durationInPixels = Math.max(24, calculatedDurationInPixels);
  } catch {
    reignDurationInPixels = 0;
    reignStartDurationInPixels = 0;
    postReignDurationInPixels = 0;
    durationInPixels = 0;
  }

  const cursorClassName = canEventMove
    ? 'cursor-move'
    : canCreateGroup && !isShiftPressed
    ? 'cursor-not-allowed'
    : 'cursor-pointer';
  const pointerEventsNoneClassName = isThrough ? 'pointer-events-none' : '';
  const rectClassName = `${cursorClassName} ${pointerEventsNoneClassName}`;
  const textClassName = `${rectClassName} select-none`;

  const x = position - 25;
  const y = temporaryVerticalPosition || startDurationInPixels;
  const fill = isReligion ? RELIGION_PALETTE[religion] : color ?? PALETTE[10];

  return (
    <g>
      <rect
        className={rectClassName}
        x={x}
        y={y}
        height={reignStartDurationInPixels}
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
        height={reignDurationInPixels}
        width={WIDTH}
        fill={fill}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <rect
        className={rectClassName}
        x={x}
        y={y + reignStartDurationInPixels + reignDurationInPixels}
        height={postReignDurationInPixels}
        width={WIDTH}
        fill={WHITE}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <text
        className={textClassName}
        style={{ clipPath: 'inset(0px calc(50% - 18px))' }}
        x={x + WIDTH / 2}
        y={y + durationInPixels / 2}
        textAnchor="middle"
        alignmentBaseline="middle"
        fill={getFontWhiteOrBlack(fill)}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      >
        {children}
      </text>
      <rect
        className={pointerEventsNoneClassName}
        x={x}
        y={y}
        height={durationInPixels}
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
