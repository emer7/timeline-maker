import React from 'react';

import { parseMultipleFormat, calculateDuration } from '../utils';
import { getFontWhiteOrBlack } from '../utils/color';

import { WIDTH, PALETTE, WHITE, RELIGION_PALETTE, BLACK } from '../consts';

export const Bar = ({ minStartDate, ...props }) => {
  const {
    eventIndex,
    isShiftPressed,
    yearInPixels,
    event,
    position,
    width = WIDTH,
    temporaryVerticalPosition,
    canEventMove,
    canCreateGroup,
    isThrough,
    isOrigin,
    isDestination,
    isGroupSelection,
    isReligion,
    isTitleClipped,
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
      minStartDate,
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

  const x = position - width / 2;
  const y = temporaryVerticalPosition || startDurationInPixels;
  const fill = isReligion ? RELIGION_PALETTE[religion] : color ?? PALETTE[16];

  const isHeightLargerThanWidth = durationInPixels > width;

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
        rx="4"
        height={durationInPixels}
        width={width}
        fill={fill}
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : BLACK
        }
        strokeWidth={canEventMove ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <clipPath id={eventIndex}>
        <rect
          x={x + (canEventMove ? 1.5 : 0.5)}
          y={y + (canEventMove ? 1.5 : 0.5)}
          rx={canEventMove ? 2.5 : 3.5}
          height={Math.max(0, durationInPixels - (canEventMove ? 3 : 1))}
          width={width - (canEventMove ? 3 : 1)}
        />
      </clipPath>
      <g clipPath={isTitleClipped ? `url(#${eventIndex})` : undefined}>
        <text
          className={textClassName}
          x={x + width / 2} // position
          y={y + durationInPixels / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={
            isHeightLargerThanWidth
              ? `rotate(270,${x + width / 2},${y + durationInPixels / 2})`
              : undefined
          }
          fill={getFontWhiteOrBlack(fill)}
          onMouseDown={handleOnMouseDown}
          onMouseUp={handleOnMouseUp}
          onMouseLeave={handleOnMouseLeave}
        >
          {description}
        </text>
      </g>
    </g>
  );
};

export const WithReign = ({
  eventIndex,
  isShiftPressed,
  yearInPixels,
  event,
  position,
  width = WIDTH,
  temporaryVerticalPosition,
  canEventMove,
  canCreateGroup,
  isThrough,
  isOrigin,
  isDestination,
  isGroupSelection,
  isReligion,
  isTitleClipped,
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
    durationInPixels = Math.max(24, calculatedDurationInPixels);
  } catch {
    reignDurationInPixels = 0;
    reignStartDurationInPixels = 0;
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

  const x = position - width / 2;
  const y = temporaryVerticalPosition || startDurationInPixels;
  const fill = isReligion ? RELIGION_PALETTE[religion] : color ?? PALETTE[10];

  const isHeightLargerThanWidth = durationInPixels > width;

  return (
    <g>
      <rect
        className={rectClassName}
        x={x}
        y={y}
        rx="4"
        height={durationInPixels}
        width={width}
        fill={WHITE}
        stroke={
          isOrigin
            ? '#b7245c'
            : isDestination
            ? '#00a6fb'
            : isGroupSelection
            ? '#5FAD41'
            : BLACK
        }
        strokeWidth={canEventMove ? 3 : 1}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
      />
      <clipPath id={eventIndex}>
        <rect
          x={x + (canEventMove ? 1.5 : 0.5)}
          y={y + (canEventMove ? 1.5 : 0.5)}
          rx={canEventMove ? 2.5 : 3.5}
          height={Math.max(0, durationInPixels - (canEventMove ? 3 : 1))}
          width={width - (canEventMove ? 3 : 1)}
        />
      </clipPath>
      <rect
        className={rectClassName}
        x={x}
        y={y + reignStartDurationInPixels}
        height={reignDurationInPixels}
        width={width}
        fill={fill}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseLeave={handleOnMouseLeave}
        clipPath={`url(#${parsedReignStartDate.getTime()})`}
      />
      <g clipPath={isTitleClipped ? `url(#${eventIndex})` : undefined}>
        <text
          className={textClassName}
          x={x + width / 2} // position
          y={y + durationInPixels / 2}
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={
            isHeightLargerThanWidth
              ? `rotate(270,${x + width / 2},${y + durationInPixels / 2})`
              : undefined
          }
          fill={getFontWhiteOrBlack(fill)}
          onMouseDown={handleOnMouseDown}
          onMouseUp={handleOnMouseUp}
          onMouseLeave={handleOnMouseLeave}
        >
          {children}
        </text>
      </g>
    </g>
  );
};
