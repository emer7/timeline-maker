import React from 'react';
import { isAfter, isBefore, max, min, format } from 'date-fns';

import {
  parseNumericalFullDate,
  parseMultipleFormat,
  calculateDuration,
} from '../utils';
import { NUMERICAL_FULL_DATE_FORMAT, SAMPLE_EVENT } from '../consts';

import { Add } from './Add';
import { Events } from './Events';
import { Popup } from './Popup';
import { Links } from './Links';
import { Grid } from './Grid';
import { Years } from './Years';
import { Bar } from './Bar';

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

const removeElementByIndex = (array, index) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
];

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

  React.useEffect(() => {
    setScrollTop(parseFloat(localStorage.getItem('scrollTop')) || 0);
    setScrollLeft(parseFloat(localStorage.getItem('scrollLeft')) || 0);
    setYearInPixels(parseFloat(localStorage.getItem('yearInPixels')) || 6);
  }, []);

  const [scrollTop, setScrollTop] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [yearInPixels, setYearInPixels] = React.useState(6);
  const handleResetYearInPixels = () => {
    setYearInPixels(6);
  };
  const handleOnWheelDocument = e => {
    const { deltaY, deltaX } = e;

    if (isCtrlPressed) {
      setYearInPixels(
        latestYearInPixels => latestYearInPixels + (deltaY > 0 ? 1 : -1) * 0.2
      );
    } else if (isShiftPressed) {
      setScrollLeft(scrollLeft => scrollLeft + deltaX);
    } else {
      const parsedMinStartDate = parseNumericalFullDate(minStartDate);
      const parsedMaxEndDate = parseNumericalFullDate(maxEndDate);
      const maximumScrollDistance = calculateDuration(
        parsedMinStartDate,
        parsedMaxEndDate,
        yearInPixels
      );

      setScrollTop(scrollTop =>
        Math.min(Math.max(scrollTop + deltaY, 0), maximumScrollDistance - vh)
      );
    }
  };

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
    setPositions([...positions, scrollLeft + 25]);
    setOrders([...orders, events.length]);
    setOrdersByEventIndex([...ordersByEventIndex, events.length]);
    setVisibility([...visibility, true]);
  };
  const handleDeleteEvent = index => {
    const slicedEvents = removeElementByIndex(events, index);
    const slicedPositions = removeElementByIndex(positions, index);

    const orderIndex = ordersByEventIndex[index];
    const slicedOrders = removeElementByIndex(orders, orderIndex);
    const slicedAndMappedOrdersByEventIndex = removeElementByIndex(
      ordersByEventIndex,
      index
    ).map(order => (order > orderIndex ? order - 1 : order));

    const slicedVisibility = removeElementByIndex(visibility, index);

    setEvents(slicedEvents);
    setPositions(slicedPositions);
    setOrders(slicedOrders);
    setOrdersByEventIndex(slicedAndMappedOrdersByEventIndex);
    setVisibility(slicedVisibility);

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

  React.useEffect(() => {
    document.addEventListener('wheel', handleOnWheelDocument);

    return () => {
      document.removeEventListener('wheel', handleOnWheelDocument);
    };
  }, [isCtrlPressed, isShiftPressed, minStartDate, maxEndDate]);

  const [isPopup, setIsPopup] = React.useState(false);
  const [clickedIndex, setClickedIndex] = React.useState(-1);
  const [canMove, setCanMove] = React.useState(false);
  const [canCreateGroup, setCanCreateGroup] = React.useState(false);
  const [holdTimer, setHoldTimer] = React.useState();
  const handleOnMouseDownOnBar = index => {
    const timer = setTimeout(() => {
      if (groupSelection.includes(index)) {
        if (isShiftPressed) {
          setCanCreateGroup(true);
        }

        setClickedIndex(index);
        setCanMove(true);
        setIsPopup(false);
      } else if (!isShiftPressed && !groupSelection.length) {
        setClickedIndex(index);
        setCanMove(true);
        setIsPopup(false);

        const lastIndex = orders.length - 1;
        const orderIndex = ordersByEventIndex[index];
        if (orderIndex !== lastIndex) {
          setOrders([...removeElementByIndex(orders, orderIndex), index]);

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

    if (canMove) {
      setCanCreateGroup(false);
      setCanMove(false);
      setTemporaryHorizontalPosition();
      setTemporaryVerticalPosition();
      if (
        index !== undefined &&
        isShiftPressed &&
        groupSelection.length &&
        canCreateGroup
      ) {
        handleCreateGroup(index);
      }
    } else {
      // Cannot index === undefined because popup doesn't have index
      if (e.target.id === 'main-svg') {
        setIsPopup(false);
      }

      if (index !== undefined) {
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
    }
  };
  const handleOnMouseLeave = () => {
    clearTimeout(holdTimer);
  };
  const handleOnMouseMove = e => {
    const { clientX, clientY } = e;

    if (canMove) {
      const steppedX = Math.floor((scrollLeft + clientX) / 10) * 10;

      // can omit && groupSelection.includes(index), see handleOnMouseDownOnBar
      if (isShiftPressed) {
        setTemporaryHorizontalPosition(
          groupSelection.map(
            (_, groupMemberIndex) =>
              scrollLeft +
              clientX -
              (groupSelection.length - 1 - groupMemberIndex) * 10
          )
        );

        const baseEvent = events[groupSelection[groupSelection.length - 1]];
        const { startDate, endDate } = baseEvent;

        const parsedStartDate = parseMultipleFormat(startDate);
        const parsedEndDate = parseMultipleFormat(endDate);

        const baseHeight =
          calculateDuration(parsedStartDate, parsedEndDate, yearInPixels) / 2;

        setTemporaryVerticalPosition(
          groupSelection.map(
            (_, groupMemberIndex) =>
              scrollTop +
              clientY -
              baseHeight -
              (groupSelection.length - 1 - groupMemberIndex) * 10
          )
        );
      } else {
        if (!groupSelection.length) {
          setPositions([
            ...positions.slice(0, clickedIndex),
            steppedX,
            ...positions.slice(clickedIndex + 1),
          ]);
        } else {
          const relativePositionsToClickedEvent = groupSelection.map(
            groupMemberIndex =>
              positions[clickedIndex] - positions[groupMemberIndex]
          );

          const editedPositions = positions.map((position, eventIndex) =>
            !groupSelection.includes(eventIndex)
              ? position
              : steppedX -
                relativePositionsToClickedEvent[
                  groupSelection.indexOf(eventIndex)
                ]
          );

          setPositions(editedPositions);
        }
      }

      setIsPopup(false);
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
  }, [isShiftPressed, canMove]);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleOnMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleOnMouseMove);
    };
  }, [canMove, clickedIndex]);

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
    setLinks(removeElementByIndex(links, index));
  };

  const [temporaryHorizontalPositions, setTemporaryHorizontalPosition] =
    React.useState();
  const [temporaryVerticalPosition, setTemporaryVerticalPosition] =
    React.useState();
  const [groupSelection, setGroupSelection] = React.useState([]);
  const handleClearGroupSelection = () => {
    setGroupSelection([]);
  };
  const handleCreateGroup = parentIndex => {
    const parentEvent = events[parentIndex];

    const editedParentEvent = {
      ...parentEvent,
      children: groupSelection,
    };

    const slicedEvents = [
      ...events.slice(0, parentIndex),
      editedParentEvent,
      ...events.slice(parentIndex + 1),
    ];

    setEvents(slicedEvents);
    setGroupSelection([]);
  };
  const handleChildrenVisibility = children => {
    setVisibility(
      visibility.map((value, index) =>
        children.includes(index) ? !value : value
      )
    );
  };

  const [isReligion, setIsReligion] = React.useState(false);
  const handleToggleIsReligion = () => {
    setIsReligion(!isReligion);
  };

  const [previewEvent, setPreviewEvent] = React.useState();
  const handlePreviewEventChange = newFields => {
    newFields
      ? setPreviewEvent({
          ...previewEvent,
          ...newFields,
        })
      : setPreviewEvent();
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
    localStorage.setItem('scrollLeft', scrollLeft);
    localStorage.setItem('scrollTop', scrollTop);
    localStorage.setItem('yearInPixels', yearInPixels);
  };

  const bottomButtonClassName =
    'px-8 h-12 flex items-center justify-center rounded-full cursor-pointer select-none';

  return (
    <div>
      <svg
        id="main-svg"
        className="fixed"
        width={vw}
        height={vh}
        viewBox={`${scrollLeft} ${scrollTop} ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Grid
          scrollLeft={scrollLeft}
          yearInPixels={yearInPixels}
          vw={vw}
          minStartDate={minStartDate}
          maxEndDate={maxEndDate}
        />

        <Events
          isShiftPressed={isShiftPressed}
          yearInPixels={yearInPixels}
          events={events}
          minStartDate={minStartDate}
          positions={positions}
          ordersByEventIndex={ordersByEventIndex}
          visibility={visibility}
          temporaryHorizontalPositions={temporaryHorizontalPositions}
          temporaryVerticalPositions={temporaryVerticalPosition}
          clickedIndex={clickedIndex}
          canMove={canMove}
          canCreateGroup={canCreateGroup}
          origin={origin}
          destination={destination}
          groupSelection={groupSelection}
          isReligion={isReligion}
          handleOnMouseDownOnBar={handleOnMouseDownOnBar}
          handleOnMouseUp={handleOnMouseUp}
          handleOnMouseLeave={handleOnMouseLeave}
        />

        {previewEvent && previewEvent.startDate && previewEvent.endDate && (
          <Bar
            yearInPixels={yearInPixels}
            event={previewEvent}
            minStartDate={minStartDate}
            position={scrollLeft}
            isReligion={isReligion}
          />
        )}

        <Links
          yearInPixels={yearInPixels}
          events={events}
          minStartDate={minStartDate}
          positions={positions}
          links={links}
          handleDeleteLink={handleDeleteLink}
        />

        <Years
          scrollLeft={scrollLeft}
          yearInPixels={yearInPixels}
          minStartDate={minStartDate}
          maxEndDate={maxEndDate}
        />
      </svg>

      {isPopup && (
        <Popup
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          yearInPixels={yearInPixels}
          minStartDate={minStartDate}
          selectedEvent={events[clickedIndex] || {}}
          left={positions[clickedIndex]}
          handleDeleteEvent={() => handleDeleteEvent(clickedIndex)}
          handleEditEvent={editedEvent =>
            handleEditEvent(clickedIndex, editedEvent)
          }
          handleChildrenVisibility={handleChildrenVisibility}
        />
      )}

      <div className="fixed right-2 bottom-2">
        <div className="flex space-x-2">
          {groupSelection.length ? (
            <div
              className={`${bottomButtonClassName} text-white bg-green-400`}
              onClick={handleClearGroupSelection}
            >
              Clear
            </div>
          ) : (
            <>
              {yearInPixels !== 6 && (
                <div
                  className={`${bottomButtonClassName} text-white bg-yellow-400`}
                  onClick={handleResetYearInPixels}
                >
                  Reset Zoom
                </div>
              )}
              {origin !== -1 && destination !== -1 && (
                <div
                  className={`${bottomButtonClassName} text-white bg-red-400`}
                  onClick={handleAddLink}
                >
                  Link
                </div>
              )}
              <div
                className={`${bottomButtonClassName} text-white bg-gradient-to-r bg-gray-400`}
                onClick={handleToggleIsReligion}
              >
                Toggle Religion
              </div>
              <div
                className={`${bottomButtonClassName} text-white bg-blue-400`}
                onClick={handleSaveData}
              >
                Save
              </div>
              <Add
                handleAddEvent={handleAddEvent}
                handlePreviewEventChange={handlePreviewEventChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
