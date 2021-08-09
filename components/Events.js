import React from 'react';

import { Bar } from './Bar';

export const Events = ({ vw, events, minStartDate, positions }) =>
  events.map((event, eventIndex) => (
    <Bar
      key={JSON.stringify(event)}
      vw={vw}
      event={event}
      minStartDate={minStartDate}
      position={positions[eventIndex]}
    />
  ));
