import React from 'react';

import { Add } from './Add';

import { SAMPLE_EVENT } from '../consts';

export const App = () => {
  React.useEffect(() => {
    const parsedEvents = JSON.parse(localStorage.getItem('events'));

    parsedEvents && setEvents(parsedEvents);
  }, []);

  const [events, setEvents] = React.useState([SAMPLE_EVENT]);
  const handleAddEvent = event => {
    setEvents([...events, event]);
  };

  return (
    <div>
      <div className="fixed right-2 bottom-2">
        <Add handleAddEvent={handleAddEvent} />
      </div>
    </div>
  );
};
