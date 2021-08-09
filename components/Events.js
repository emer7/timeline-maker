import React from 'react';

import { Bar } from './Bar';

export const Events = ({ events, minStartDate }) =>
  events.map(event => (
    <Bar
      key={JSON.stringify(event)}
      event={event}
      minStartDate={minStartDate}
    />
  ));
