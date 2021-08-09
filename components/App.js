import React from 'react';

import { SAMPLE_EVENT } from '../consts';

export const App = () => {
  React.useEffect(() => {
    const parsedEvents = JSON.parse(localStorage.getItem('events'));

    parsedEvents && setEvents(parsedEvents);
  }, []);

  const [events, setEvents] = React.useState([SAMPLE_EVENT]);

  return (
    <div>
    </div>
  );
};
