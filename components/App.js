import React from 'react';
import { isAfter, isBefore, max, min, format } from 'date-fns';

import { parseNumericalFullDate, parseMultipleFormat } from '../utils';
import { NUMERICAL_FULL_DATE_FORMAT, SAMPLE_EVENT } from '../consts';

import { Add } from './Add';
import { Events } from './Events';

const calculateMinStartDate = events => {
  const mappedEvents = events
    .map(({ startDate }) => startDate)
    .map(startDate => parseMultipleFormat(startDate));

  const minStartDate = min(mappedEvents);

  return format(minStartDate, NUMERICAL_FULL_DATE_FORMAT);
};

const calculateMaxEndDate = events => {
  const mappedEvents = events
    .map(({ endDate }) => endDate)
    .map(endDate => parseMultipleFormat(endDate));

  const maxEndDate = max(mappedEvents);

  return format(maxEndDate, NUMERICAL_FULL_DATE_FORMAT);
};

export const App = () => {
  React.useEffect(() => {
    document.addEventListener('mouseup', handleOnMouseUp);
    document.addEventListener('keydown', handleKeyDownDocument);
    document.addEventListener('keyup', handleKeyUpDocument);

    return () => {
      document.removeEventListener('mouseup', handleOnMouseUp);
      document.removeEventListener('keydown', handleKeyDownDocument);
      document.removeEventListener('keyup', handleKeyUpDocument);
    };
  }, []);

  const [isCtrlPressed, setIsCtrlPressed] = React.useState(false);
  const handleKeyDownDocument = e => {
    const { code } = e;

    if (code === 'ControlLeft') {
      setIsCtrlPressed(true);
    }
  };
  const handleKeyUpDocument = e => {
    const { code } = e;

    if (code === 'ControlLeft') {
      setIsCtrlPressed(false);
    }
  };

  const [scrollTop, setScrollTop] = React.useState(0);
  const [yearInPixels, setYearInPixels] = React.useState(6);
  const handleOnWheelDocument = e => {
    const { deltaY } = e;

    setScrollTop(scrollTop => Math.max(scrollTop + deltaY, 0));

    if (isCtrlPressed) {
      setYearInPixels(
        latestYearInPixels => latestYearInPixels + (deltaY > 0 ? 1 : -1) * 0.2
      );
    }
  };

  React.useEffect(() => {
    document.addEventListener('wheel', handleOnWheelDocument);

    return () => {
      document.removeEventListener('wheel', handleOnWheelDocument);
    };
  }, [isCtrlPressed]);

  React.useEffect(() => {
    setVw(
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      )
    );

    setVh(
      Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      )
    );

    const handleResize = () => {
      setVw(
        Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        )
      );

      setVh(
        Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0
        )
      );
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [vw, setVw] = React.useState();
  const [vh, setVh] = React.useState();

  React.useEffect(() => {
    const parsedEvents = JSON.parse(localStorage.getItem('events'));
    const parsedPositions = JSON.parse(localStorage.getItem('positions'));

    if (parsedEvents) {
      setEvents(parsedEvents);
      setMinStartDate(calculateMinStartDate(parsedEvents));
      setMaxEndDate(calculateMaxEndDate(parsedEvents));
    }
    parsedPositions && setPositions(parsedPositions);
  }, []);

  const [events, setEvents] = React.useState([SAMPLE_EVENT]);
  const [minStartDate, setMinStartDate] = React.useState(() =>
    calculateMinStartDate(events)
  );
  const [maxEndDate, setMaxEndDate] = React.useState(() =>
    calculateMaxEndDate(events)
  );
  const [positions, setPositions] = React.useState([0]);
  const handleAddEvent = event => {
    const { startDate, endDate } = event;

    const parsedStartDate = parseMultipleFormat(startDate);
    const parsedEndDate = parseMultipleFormat(endDate);
    const parsedMinStartDate = parseNumericalFullDate(minStartDate);
    const parsedMaxEndDate = parseNumericalFullDate(maxEndDate);

    isBefore(parsedStartDate, parsedMinStartDate) &&
      setMinStartDate(format(parsedStartDate, NUMERICAL_FULL_DATE_FORMAT));
    isAfter(parsedEndDate, parsedMaxEndDate) &&
      setMaxEndDate(format(parsedEndDate, NUMERICAL_FULL_DATE_FORMAT));

    setEvents([...events, event]);
    setPositions([...positions, 0]);
  };

  const [clickedIndex, setClickedIndex] = React.useState(-1);
  const [isHold, setIsHold] = React.useState(false);
  const [canMove, setCanMove] = React.useState(false);
  const [holdTimer, setHoldTimer] = React.useState();
  const handleOnMouseDownOnBar = index => {
    const timer = setTimeout(() => {
      setClickedIndex(index);
      setIsHold(true);
      setCanMove(true);
    }, 250);

    setHoldTimer(timer);
  };
  const handleOnMouseUp = (e, index) => {
    e.stopPropagation();

    clearTimeout(holdTimer);
    setIsHold(false);
    setCanMove(false);

    if (index !== undefined && !canMove) {
      setClickedIndex(index);
    }
  };
  const handleOnMouseLeave = () => {
    clearTimeout(holdTimer);
  };
  const handleOnMouseMove = e => {
    const { clientX } = e;

    if (canMove) {
      const steppedX = Math.floor(clientX / 10) * 10;

      setPositions([
        ...positions.slice(0, clickedIndex),
        steppedX,
        ...positions.slice(clickedIndex + 1),
      ]);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleOnMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleOnMouseMove);
    };
  }, [canMove && clickedIndex]);

  const handleSaveData = () => {
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('positions', JSON.stringify(positions));
  };

  return (
    <div>
      <svg
        className="fixed"
        width={vw}
        height={vh}
        viewBox={`0 ${scrollTop} ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Events
          yearInPixels={yearInPixels}
          vw={vw}
          events={events}
          minStartDate={minStartDate}
          positions={positions}
          clickedIndex={clickedIndex}
          isHold={isHold}
          handleOnMouseDownOnBar={handleOnMouseDownOnBar}
          handleOnMouseUp={handleOnMouseUp}
          handleOnMouseLeave={handleOnMouseLeave}
        />
      </svg>

      <div className="fixed right-2 bottom-2">
        <Add handleAddEvent={handleAddEvent} handleSaveData={handleSaveData} />
      </div>
    </div>
  );
};
