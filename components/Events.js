import React from 'react';

import { Bar } from './Bar';

export const Events = ({
  yearInPixels,
  vw,
  events,
  minStartDate,
  positions,
  ordersByEventIndex,
  visibility,
  temporaryHorizontalPositions,
  temporaryVerticalPositions,
  clickedIndex,
  isHold,
  origin,
  destination,
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
          ? (groupSelection.findIndex(
              groupMemberIndex => groupMemberIndex === eventAIndex
            ) +
              1) *
            1000000
          : ordersByEventIndex[eventAIndex]) -
        (isBGroupSelection
          ? (groupSelection.findIndex(
              groupMemberIndex => groupMemberIndex === eventBIndex
            ) +
              1) *
            1000000
          : ordersByEventIndex[eventBIndex])
      );
    })
    .filter(eventIndex => visibility[eventIndex])
    .map(eventIndex => {
      const isGroupSelection = groupSelection.includes(eventIndex);
      const position =
        temporaryHorizontalPositions && isGroupSelection
          ? temporaryHorizontalPositions[
              groupSelection.findIndex(
                groupMemberIndex => groupMemberIndex === eventIndex
              )
            ]
          : positions[eventIndex];

      const temporaryVerticalPosition =
        temporaryVerticalPositions &&
        isGroupSelection &&
        temporaryVerticalPositions[
          groupSelection.findIndex(
            groupMemberIndex => groupMemberIndex === eventIndex
    )
        ];

      return (
      <Bar
        key={JSON.stringify(events[eventIndex])}
        yearInPixels={yearInPixels}
        vw={vw}
        event={events[eventIndex]}
        minStartDate={minStartDate}
          position={position}
          temporaryVerticalPosition={temporaryVerticalPosition}
          isHold={clickedIndex === eventIndex && isHold}
        isOrigin={origin === eventIndex}
        isDestination={destination === eventIndex}
          isGroupSelection={isGroupSelection}
        handleOnMouseDown={() => handleOnMouseDownOnBar(eventIndex)}
        handleOnMouseUp={e => handleOnMouseUp(e, eventIndex)}
        handleOnMouseLeave={handleOnMouseLeave}
      />
      );
    });
