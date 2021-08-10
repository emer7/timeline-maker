import React from 'react';

import { Bar } from './Bar';

export const Events = ({
  vw,
  events,
  minStartDate,
  positions,
  clickedIndex,
  isHold,
  handleOnMouseDownOnBar,
  handleOnMouseUp,
  handleOnMouseLeave,
}) =>
  events.map((event, eventIndex) => (
    <Bar
      key={JSON.stringify(event)}
      vw={vw}
      event={event}
      minStartDate={minStartDate}
      position={positions[eventIndex]}
      isHold={clickedIndex === eventIndex && isHold}
      handleOnMouseDown={() => handleOnMouseDownOnBar(eventIndex)}
      handleOnMouseUp={e => handleOnMouseUp(e, eventIndex)}
      handleOnMouseLeave={handleOnMouseLeave}
    />
  ));
