import React from 'react';

import { Bar } from './Bar';

export const Events = ({
  isShiftPressed,
  yearInPixels,
  events,
  minStartDate,
  positions,
  widths,
  ordersByEventIndex,
  visibility,
  temporaryHorizontalPositions,
  temporaryVerticalPositions,
  clickedIndex,
  canMove,
  canCreateGroup,
  origin,
  destination,
  isReligion,
  isTitleClipped,
  groupSelection,
  handleOnMouseDownOnBar,
  handleOnMouseUp,
  handleOnMouseLeave,
}) =>
  [...events.keys()]
    .sort((eventAIndex, eventBIndex) => {
      const isAGroupSelection = groupSelection.includes(eventAIndex);
      const isBGroupSelection = groupSelection.includes(eventBIndex);

      return (
        (isAGroupSelection
          ? (groupSelection.indexOf(eventAIndex) + 1) * 1000000
          : ordersByEventIndex[eventAIndex]) -
        (isBGroupSelection
          ? (groupSelection.indexOf(eventBIndex) + 1) * 1000000
          : ordersByEventIndex[eventBIndex])
      );
    })
    .filter(eventIndex => visibility[eventIndex])
    .map(eventIndex => {
      const isGroupSelection = groupSelection.includes(eventIndex);
      const position =
        temporaryHorizontalPositions && isGroupSelection
          ? temporaryHorizontalPositions[groupSelection.indexOf(eventIndex)]
          : positions[eventIndex];
      const width = widths[eventIndex];

      const temporaryVerticalPosition =
        temporaryVerticalPositions &&
        isGroupSelection &&
        temporaryVerticalPositions[groupSelection.indexOf(eventIndex)];

      const isGroupSelectionMemberMoving = isGroupSelection && canMove;
      const isThrough = isGroupSelectionMemberMoving && canCreateGroup;

      return (
        <Bar
          key={JSON.stringify(events[eventIndex])}
          eventIndex={eventIndex}
          isShiftPressed={isShiftPressed}
          yearInPixels={yearInPixels}
          event={events[eventIndex]}
          minStartDate={minStartDate}
          position={position}
          width={width}
          temporaryVerticalPosition={temporaryVerticalPosition}
          canEventMove={
            isGroupSelectionMemberMoving ||
            (clickedIndex === eventIndex && canMove)
          }
          canCreateGroup={canCreateGroup}
          isThrough={isThrough}
          isOrigin={origin === eventIndex}
          isDestination={destination === eventIndex}
          isGroupSelection={isGroupSelection}
          isReligion={isReligion}
          isTitleClipped={isTitleClipped}
          handleOnMouseDown={e => {
            e.stopPropagation();
            handleOnMouseDownOnBar(eventIndex);
          }}
          handleOnMouseUp={e => handleOnMouseUp(e, eventIndex)}
          handleOnMouseLeave={handleOnMouseLeave}
        />
      );
    });
