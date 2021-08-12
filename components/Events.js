import React from 'react';

import { Bar } from './Bar';

export const Events = ({
  yearInPixels,
  vw,
  events,
  minStartDate,
  positions,
  ordersByEventIndex,
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
    .sort(
      (eventAIndex, eventBIndex) =>
        ordersByEventIndex[eventAIndex] - ordersByEventIndex[eventBIndex]
    )
    .map(eventIndex => (
      <Bar
        key={JSON.stringify(events[eventIndex])}
        yearInPixels={yearInPixels}
        vw={vw}
        event={events[eventIndex]}
        minStartDate={minStartDate}
        position={positions[eventIndex]}
        isHold={clickedIndex === eventIndex && isHold}
        isOrigin={origin === eventIndex}
        isDestination={destination === eventIndex}
        isGroupSelection={groupSelection.includes(eventIndex)}
        handleOnMouseDown={() => handleOnMouseDownOnBar(eventIndex)}
        handleOnMouseUp={e => handleOnMouseUp(e, eventIndex)}
        handleOnMouseLeave={handleOnMouseLeave}
      />
    ));
