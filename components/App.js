import React from 'react';
import { isAfter, isBefore, max, min, format } from 'date-fns';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateStartDuration,
} from '../utils';
import { NUMERICAL_FULL_DATE_FORMAT, SAMPLE_EVENT } from '../consts';

import { Add } from './Add';
import { Events } from './Events';
import { Popup } from './Popup';
import { Links } from './Links';

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

const setBoundaryDate = (events, setMinStartDate, setMaxEndDate) => {
  const newMinStartDate = calculateMinStartDate(events);
  const newMaxEndDate = calculateMaxEndDate(events);

  setMinStartDate(newMinStartDate);
  setMaxEndDate(newMaxEndDate);
};

export const App = () => {
  const [isAltPressed, setIsAltPressed] = React.useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = React.useState(false);
  const [isShiftPressed, setIsShiftPressed] = React.useState(false);
  const handleKeyDownDocument = e => {
    const { code } = e;

    if (code === 'ControlLeft') {
      setIsCtrlPressed(true);
    } else if (code === 'AltLeft') {
      setIsAltPressed(true);
    } else if (code === 'ShiftLeft') {
      setIsShiftPressed(true);
    }
  };
  const handleKeyUpDocument = e => {
    const { code } = e;

    if (code === 'ControlLeft') {
      setIsCtrlPressed(false);
    } else if (code === 'AltLeft') {
      setIsAltPressed(false);
    } else if (code === 'ShiftLeft') {
      setIsShiftPressed(false);
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

  const [vw, setVw] = React.useState(0);
  const [vh, setVh] = React.useState(0);

  React.useEffect(() => {
    const parsedEvents = JSON.parse(localStorage.getItem('events'));
    const parsedPositions = JSON.parse(localStorage.getItem('positions'));
    const parsedOrders = JSON.parse(localStorage.getItem('orders'));
    const parsedOrdersByEventIndex = JSON.parse(
      localStorage.getItem('ordersByEventIndex')
    );

    const calculatedOrders = parsedOrders
      ? parsedOrders
      : parsedEvents && parsedEvents.map((_, index) => index);

    if (parsedEvents) {
      setEvents(parsedEvents);
      setMinStartDate(calculateMinStartDate(parsedEvents));
      setMaxEndDate(calculateMaxEndDate(parsedEvents));
      setVisibility(parsedEvents.map(_ => true));
    }
    parsedPositions && setPositions(parsedPositions);
    calculatedOrders && setOrders(calculatedOrders);
    parsedOrdersByEventIndex
      ? setOrdersByEventIndex(parsedOrdersByEventIndex)
      : calculatedOrders &&
        setOrdersByEventIndex(
          [...calculatedOrders.keys()].sort(
            (orderA, orderB) =>
              calculatedOrders[orderA] - calculatedOrders[orderB]
          )
        );
  }, []);

  const [events, setEvents] = React.useState([SAMPLE_EVENT]);
  const [minStartDate, setMinStartDate] = React.useState(() =>
    calculateMinStartDate(events)
  );
  const [maxEndDate, setMaxEndDate] = React.useState(() =>
    calculateMaxEndDate(events)
  );
  const [positions, setPositions] = React.useState([0]);
  const [orders, setOrders] = React.useState([0]);
  const [ordersByEventIndex, setOrdersByEventIndex] = React.useState([0]);
  const [visibility, setVisibility] = React.useState([true]);
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
    setOrders([...orders, events.length]);
    setOrdersByEventIndex([...ordersByEventIndex, events.length]);
  };
  const handleDeleteEvent = index => {
    const slicedEvents = [
      ...events.slice(0, index),
      ...events.slice(index + 1),
    ];

    const slicedPositions = [
      ...positions.slice(0, index),
      ...positions.slice(index + 1),
    ];

    const orderIndex = ordersByEventIndex[index];
    const slicedOrders = [
      ...orders.slice(0, orderIndex),
      ...orders.slice(orderIndex + 1),
    ];

    const slicedAndMappedOrdersByEventIndex = [
      ...ordersByEventIndex.slice(0, index),
      ...ordersByEventIndex.slice(index + 1),
    ].map(order => (order > orderIndex ? order - 1 : order));

    setEvents(slicedEvents);
    setPositions(slicedPositions);
    setOrders(slicedOrders);
    setOrdersByEventIndex(slicedAndMappedOrdersByEventIndex);

    setBoundaryDate(slicedEvents, setMinStartDate, setMaxEndDate);

    setIsPopup(false);
  };
  const handleEditEvent = (index, editedEvent) => {
    const slicedEvents = [
      ...events.slice(0, index),
      editedEvent,
      ...events.slice(index + 1),
    ];

    setEvents(slicedEvents);

    setBoundaryDate(slicedEvents, setMinStartDate, setMaxEndDate);
  };

  const [isPopup, setIsPopup] = React.useState(false);
  const [clickedIndex, setClickedIndex] = React.useState(-1);
  const [isHold, setIsHold] = React.useState(false);
  const [canMove, setCanMove] = React.useState(false);
  const [holdTimer, setHoldTimer] = React.useState();
  const handleOnMouseDownOnBar = index => {
    const timer = setTimeout(() => {
      if (isShiftPressed && groupSelection.length) {
        setClickedIndex(-1);
        setIsHold(true);
        setCanMove(true);
        setIsPopup(false);
      } else if (!isShiftPressed && !groupSelection.length) {
      setClickedIndex(index);
        setIsHold(true);
        setCanMove(true);
        setIsPopup(false);

      const lastIndex = orders.length - 1;
      const orderIndex = ordersByEventIndex[index];
      if (orderIndex !== lastIndex) {
        setOrders([
          ...orders.slice(0, orderIndex),
          ...orders.slice(orderIndex + 1),
          index,
        ]);

        const mappedOrdersByEventIndex = ordersByEventIndex.map(order =>
          order === orderIndex
            ? lastIndex
            : order > orderIndex
            ? order - 1
            : order
        );

        setOrdersByEventIndex(mappedOrdersByEventIndex);
        }
      }
    }, 250);

    setHoldTimer(timer);
  };
  const handleOnMouseUp = (e, index) => {
    e.stopPropagation();

    clearTimeout(holdTimer);
    setIsHold(false);
    setCanMove(false);

    if (e.target.nodeName === 'svg') {
      setIsPopup(false);
    }

    if (index !== undefined && !canMove) {
      if (isAltPressed) {
        if (origin === -1 || destination !== -1) {
          setOrigin(index);
          setDestination(-1);
        } else {
          setDestination(index);
        }
      } else if (isShiftPressed) {
          setGroupSelection(
            groupSelection.includes(index)
              ? groupSelection.filter(
                  groupMemberIndex => groupMemberIndex !== index
                )
            : [...groupSelection, index].sort(
                (eventAIndex, eventBIndex) =>
                  positions[eventAIndex] - positions[eventBIndex]
              )
          );
      } else {
        setClickedIndex(index);
        setIsPopup(true);
      }
    }

    if (isShiftPressed && canMove) {
        setTemporaryHorizontalPosition();
        setTemporaryVerticalPosition();
    }
  };
  const handleOnMouseLeave = () => {
    clearTimeout(holdTimer);
  };
  const handleOnMouseMove = e => {
    const { clientX, clientY } = e;

    if (canMove) {
      const steppedX = Math.floor(clientX / 10) * 10;

      if (isShiftPressed && groupSelection.length) {
        setTemporaryHorizontalPosition(
          groupSelection.map(
            (_, groupMemberIndex) =>
              clientX - (groupSelection.length - 1 - groupMemberIndex) * 10
          )
        );

        const baseEvent = events[groupSelection[groupSelection.length - 1]];
        const { startDate } = baseEvent;

        const parsedMinStartDate = parseNumericalFullDate(minStartDate);
        const parsedStartDate = parseMultipleFormat(startDate);

        const baseHeight =
          calculateStartDuration(
            parsedMinStartDate,
            parsedStartDate,
            yearInPixels
          ) / 2;

        setTemporaryVerticalPosition(
          groupSelection.map(
            (_, groupMemberIndex) =>
              clientY -
              baseHeight -
              (groupSelection.length - 1 - groupMemberIndex) * 10
          )
        );

        setIsPopup(false);
      } else {
      setPositions([
        ...positions.slice(0, clickedIndex),
        steppedX,
        ...positions.slice(clickedIndex + 1),
      ]);

      setIsPopup(false);
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('mouseup', handleOnMouseUp);
    document.addEventListener('keydown', handleKeyDownDocument);
    document.addEventListener('keyup', handleKeyUpDocument);

    return () => {
      document.removeEventListener('mouseup', handleOnMouseUp);
      document.removeEventListener('keydown', handleKeyDownDocument);
      document.removeEventListener('keyup', handleKeyUpDocument);
    };
  }, [isShiftPressed && canMove]);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleOnMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleOnMouseMove);
    };
  }, [canMove && clickedIndex]);

  React.useEffect(() => {
    const parsedLinks = JSON.parse(localStorage.getItem('links'));

    parsedLinks && setLinks(parsedLinks);
  }, []);

  const [links, setLinks] = React.useState([{ origin: 0, destination: 0 }]);
  const [origin, setOrigin] = React.useState(-1);
  const [destination, setDestination] = React.useState(-1);
  const handleAddLink = () => {
    origin !== -1 &&
      destination !== -1 &&
      setLinks([...links, { origin, destination }]);
    setOrigin(-1);
    setDestination(-1);
  };
  const handleDeleteLink = index => {
    setLinks([...links.slice(0, index), ...links.slice(index + 1)]);
  };

  const [temporaryHorizontalPositions, setTemporaryHorizontalPosition] =
    React.useState();
  const [temporaryVerticalPosition, setTemporaryVerticalPosition] =
    React.useState();
  const [groupSelection, setGroupSelection] = React.useState([]);
  const handleClearGroupSelection = () => {
    setGroupSelection([]);
  };

  const handleSaveData = () => {
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('positions', JSON.stringify(positions));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem(
      'ordersByEventIndex',
      JSON.stringify(ordersByEventIndex)
    );
    localStorage.setItem('links', JSON.stringify(links));
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
          ordersByEventIndex={ordersByEventIndex}
          visibility={visibility}
          temporaryHorizontalPositions={temporaryHorizontalPositions}
          temporaryVerticalPositions={temporaryVerticalPosition}
          clickedIndex={clickedIndex}
          isHold={isHold}
          canMove={canMove}
          origin={origin}
          destination={destination}
          groupSelection={groupSelection}
          handleOnMouseDownOnBar={handleOnMouseDownOnBar}
          handleOnMouseUp={handleOnMouseUp}
          handleOnMouseLeave={handleOnMouseLeave}
        />

        <Links
          yearInPixels={yearInPixels}
          events={events}
          minStartDate={minStartDate}
          positions={positions}
          links={links}
          handleDeleteLink={handleDeleteLink}
        />
      </svg>

      {isPopup && (
        <Popup
          scrollTop={scrollTop}
          yearInPixels={yearInPixels}
          minStartDate={minStartDate}
          selectedEvent={events[clickedIndex] || {}}
          left={positions[clickedIndex]}
          handleDeleteEvent={() => handleDeleteEvent(clickedIndex)}
          handleEditEvent={editedEvent =>
            handleEditEvent(clickedIndex, editedEvent)
          }
        />
      )}

      <div className="fixed right-2 bottom-2">
        {groupSelection.length ? (
          <button onClick={handleClearGroupSelection}>Clear grouping</button>
        ) : (
          <Add
            handleAddEvent={handleAddEvent}
            handleSaveData={handleSaveData}
          />
        )}
        <button onClick={handleAddLink}>Link</button>
      </div>
    </div>
  );
};
