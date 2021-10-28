import React from 'react';
import { isAfter, isBefore, max, min } from 'date-fns';

import { parseMultipleFormat, calculateDuration } from '../utils';
import { RESIZE_RIGHT, SAMPLE_EVENT, WIDTH } from '../consts';

import { Add } from './Add';
import { Events } from './Events';
import { Popup } from './Popup';
import { Links } from './Links';
import { Grid } from './Grid';
import { Years } from './Years';
import { Bar } from './Bar';
import { AddLink } from './AddLink';
import { Defs } from './Defs';
import { Storage } from './Storage';
import { Hidden } from './Hidden';
import { Search } from './Search';

const calculateMinStartDate = events => {
  const mappedEvents = events
    .map(({ startDate }) => startDate)
    .map(startDate => parseMultipleFormat(startDate));

  return min(mappedEvents);
};

const calculateMaxEndDate = events => {
  const mappedEvents = events
    .map(({ endDate }) => endDate)
    .map(endDate => parseMultipleFormat(endDate));

  return max(mappedEvents);
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
      const maximumScrollDistance = calculateDuration(
        minStartDate,
        maxEndDate,
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
    const parsedWidths = JSON.parse(localStorage.getItem('widths'));
    const parsedOrders = JSON.parse(localStorage.getItem('orders'));
    const parsedOrdersByEventIndex = JSON.parse(
      localStorage.getItem('ordersByEventIndex')
    );

    const calculatedOrders = parsedOrders
      ? parsedOrders
      : parsedEvents && parsedEvents.map((_, index) => index);

    if (parsedEvents) {
      setEvents(parsedEvents);
      setBoundaryDate(parsedEvents, setMinStartDate, setMaxEndDate);
      setVisibility(parsedEvents.map(_ => true));
    }

    setPositions(
      parsedPositions
        ? parsedPositions
        : parsedEvents && parsedEvents.map(_ => 0)
    );

    setWidths(
      parsedWidths ? parsedWidths : parsedEvents && parsedEvents.map(_ => WIDTH)
    );

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
  const [widths, setWidths] = React.useState([WIDTH]);
  const [orders, setOrders] = React.useState([0]);
  const [ordersByEventIndex, setOrdersByEventIndex] = React.useState([0]);
  const [visibility, setVisibility] = React.useState([true]);
  const handleAddEvent = event => {
    const { startDate, endDate } = event;

    const parsedStartDate = parseMultipleFormat(startDate);
    const parsedEndDate = parseMultipleFormat(endDate);

    isBefore(parsedStartDate, minStartDate) && setMinStartDate(parsedStartDate);
    isAfter(parsedEndDate, maxEndDate) && setMaxEndDate(parsedEndDate);

    setEvents([...events, event]);
    setPositions([...positions, scrollLeft + WIDTH / 2]);
    setWidths([...widths, WIDTH]);
    setOrders([...orders, events.length]);
    setOrdersByEventIndex([...ordersByEventIndex, events.length]);
    setVisibility([...visibility, true]);
  };
  const handleDeleteEvent = index => {
    const slicedEvents = removeElementByIndex(events, index);
    const slicedPositions = removeElementByIndex(positions, index);
    const slicedWidths = removeElementByIndex(widths, index);

    const orderIndex = ordersByEventIndex[index];
    const slicedOrders = removeElementByIndex(orders, orderIndex);
    const slicedAndMappedOrdersByEventIndex = removeElementByIndex(
      ordersByEventIndex,
      index
    ).map(order => (order > orderIndex ? order - 1 : order));

    const slicedVisibility = removeElementByIndex(visibility, index);

    setEvents(slicedEvents);
    setPositions(slicedPositions);
    setWidths(slicedWidths);
    setOrders(slicedOrders);
    setOrdersByEventIndex(slicedAndMappedOrdersByEventIndex);
    setVisibility(slicedVisibility);

    setBoundaryDate(slicedEvents, setMinStartDate, setMaxEndDate);

    const editedLinks = links
      .filter(
        ({ origin, destination }) => origin !== index && destination !== index
      )
      .map(({ origin, destination, ...linkProps }) => ({
        origin: origin < index ? origin : origin - 1,
        destination: destination < index ? destination : destination - 1,
        ...linkProps,
      }));

    setLinks(editedLinks);

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
  const handleHideEvent = index => {
    setVisibility([
      ...visibility.slice(0, index),
      false,
      ...visibility.slice(index + 1),
    ]);
    setIsPopup(false);
  };
  const handleHideEvents = () => {
    setVisibility(
      visibility.map((value, index) =>
        groupSelection.includes(index) ? false : value
      )
    );
  };
  const handleUnhideEvent = index => {
    setVisibility([
      ...visibility.slice(0, index),
      true,
      ...visibility.slice(index + 1),
    ]);
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
  const handleAddLink = type => {
    origin !== -1 &&
      destination !== -1 &&
      setLinks([...links, { origin, destination, type }]);
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

  const [isTitleClipped, setIsTitleClipped] = React.useState(true);
  const handleTitleClippingToggle = () => {
    setIsTitleClipped(!isTitleClipped);
  };

  const [selectBoxStartingX, setSelectBoxStartingX] = React.useState(-1);
  const [selectBoxStartingY, setSelectBoxStartingY] = React.useState(-1);
  const [selectBoxEndingX, setSelectBoxEndingX] = React.useState(-1);
  const [selectBoxEndingY, setSelectBoxEndingY] = React.useState(-1);
  const handleSvgMouseDown = e => {
    const { clientX, clientY } = e;

    const calculatedX = clientX + scrollLeft;
    const calculatedY = clientY + scrollTop;

    setSelectBoxStartingX(calculatedX);
    setSelectBoxStartingY(calculatedY);
    setSelectBoxEndingY(calculatedX);
    setSelectBoxEndingY(calculatedY);
  };

  const handleSvgMouseMove = e => {
    if (resizeStartingX !== -1) {
      const { clientX } = e;

      const deltaWidth = clientX - resizeStartingX;

      setWidths([
        ...widths.slice(0, resizeIndex),
        resizeOriginalWidth + deltaWidth * resizeDirection,
        ...widths.slice(resizeIndex + 1),
      ]);
      setPositions([
        ...positions.slice(0, resizeIndex),
        resizeOriginalPosition + deltaWidth / 2,
        ...positions.slice(resizeIndex + 1),
      ]);
    } else if (selectBoxStartingX !== -1 && selectBoxStartingY !== -1) {
      const { clientX, clientY } = e;

      const calculatedX = clientX + scrollLeft;
      const calculatedY = clientY + scrollTop;

      setSelectBoxEndingX(calculatedX);
      setSelectBoxEndingY(calculatedY);

      const selectedEvent = events
        .map((_, eventIndex) => eventIndex)
        .filter(eventIndex => {
          const position = positions[eventIndex] - widths[eventIndex] / 2;

          const { startDate, endDate } = events[eventIndex];
          const parsedStartDate = parseMultipleFormat(startDate);
          const parsedEndDate = parseMultipleFormat(endDate);

          let durationInPixels;
          let startDurationInPixels;
          try {
            durationInPixels = Math.max(
              24,
              calculateDuration(parsedStartDate, parsedEndDate, yearInPixels)
            );

            startDurationInPixels = calculateDuration(
              minStartDate,
              parsedStartDate,
              yearInPixels
            );
          } catch {
            durationInPixels = 0;
            startDurationInPixels = 0;
          }

          const endDurationInPixels = startDurationInPixels + durationInPixels;

          return (
            position <= Math.max(selectBoxStartingX, calculatedX) &&
            Math.min(selectBoxStartingX, calculatedX) <=
              position + widths[eventIndex] &&
            startDurationInPixels <=
              Math.max(selectBoxStartingY, calculatedY) &&
            Math.min(selectBoxStartingY, calculatedY) <= endDurationInPixels
          );
        });

      setGroupSelection(
        selectedEvent.sort(
          (eventAIndex, eventBIndex) =>
            positions[eventAIndex] - positions[eventBIndex]
        )
      );
    }
  };

  const handleSvgMouseUp = () => {
    setResizeStartingX(-1);
    setSelectBoxStartingX(-1);
    setSelectBoxStartingY(-1);
    setSelectBoxEndingY(-1);
    setSelectBoxEndingY(-1);
  };

  const [resizeIndex, setResizeIndex] = React.useState(-1);
  const [resizeStartingX, setResizeStartingX] = React.useState(-1);
  const [resizeDirection, setResizeDirection] = React.useState(RESIZE_RIGHT);
  const [resizeOriginalWidth, setResizeOriginalWidth] = React.useState(-1);
  const [resizeOriginalPosition, setResizeOriginalPosition] =
    React.useState(-1);
  const handleWidthResize = (
    index,
    startingX,
    direction,
    originalWidth,
    originalPosition
  ) => {
    setResizeIndex(index);
    setResizeStartingX(startingX);
    setResizeDirection(direction);
    setResizeOriginalWidth(originalWidth);
    setResizeOriginalPosition(originalPosition);
  };

  const handleSaveData = () => {
    localStorage.setItem('events', JSON.stringify(events));
    localStorage.setItem('positions', JSON.stringify(positions));
    localStorage.setItem('widths', JSON.stringify(widths));
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
    'px-8 h-12 flex items-center justify-center rounded-full cursor-pointer select-none text-white';

  return (
    <div>
      <svg
        id="main-svg"
        className="fixed"
        width={vw}
        height={vh}
        viewBox={`${scrollLeft} ${scrollTop} ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleSvgMouseDown}
        onMouseMove={
          selectBoxStartingX !== -1 && selectBoxStartingY !== -1
            ? handleSvgMouseMove
            : () => {}
        }
        onMouseUp={handleSvgMouseUp}
      >
        <Defs />

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
          widths={widths}
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
          isTitleClipped={isTitleClipped}
          handleOnMouseDownOnBar={handleOnMouseDownOnBar}
          handleOnMouseUp={handleOnMouseUp}
          handleOnMouseLeave={handleOnMouseLeave}
          handleWidthResize={handleWidthResize}
        />

        {previewEvent && previewEvent.startDate && previewEvent.endDate && (
          <Bar
            yearInPixels={yearInPixels}
            event={previewEvent}
            minStartDate={minStartDate}
            position={scrollLeft + 80}
            isReligion={isReligion}
          />
        )}

        <Links
          yearInPixels={yearInPixels}
          events={events}
          minStartDate={minStartDate}
          positions={positions}
          widths={widths}
          links={links}
          handleDeleteLink={handleDeleteLink}
        />

        <Years
          scrollLeft={scrollLeft}
          yearInPixels={yearInPixels}
          minStartDate={minStartDate}
          maxEndDate={maxEndDate}
        />

        <rect
          x={Math.min(selectBoxStartingX, selectBoxEndingX)}
          y={Math.min(selectBoxStartingY, selectBoxEndingY)}
          height={Math.abs(selectBoxEndingY - selectBoxStartingY)}
          width={Math.abs(selectBoxEndingX - selectBoxStartingX)}
          fill="transparent"
          stroke="black"
          strokeWidth={1}
        />
      </svg>

      {isPopup && (
        <Popup
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          yearInPixels={yearInPixels}
          vw={vw}
          vh={vh}
          minStartDate={minStartDate}
          selectedEvent={events[clickedIndex] || {}}
          left={positions[clickedIndex]}
          width={widths[clickedIndex]}
          handleDeleteEvent={() => handleDeleteEvent(clickedIndex)}
          handleEditEvent={editedEvent =>
            handleEditEvent(clickedIndex, editedEvent)
          }
          handleChildrenVisibility={handleChildrenVisibility}
          handleHideEvent={() => handleHideEvent(clickedIndex)}
        />
      )}

      <div className="fixed right-2 top-2 flex flex-col space-y-4">
        <Search />
        {!visibility.reduce((acc, value) => acc && value, true) && (
          <Hidden
            events={events}
            visibility={visibility}
            handleUnhideEvent={handleUnhideEvent}
          />
        )}
      </div>

      <div className="fixed right-2 bottom-2">
        <div className="flex space-x-2">
          {groupSelection.length ? (
            <>
              <div
                className={`${bottomButtonClassName} bg-yellow-400`}
                onClick={handleHideEvents}
              >
                Hide
              </div>
              <div
                className={`${bottomButtonClassName} bg-green-400`}
                onClick={handleClearGroupSelection}
              >
                Clear
              </div>
            </>
          ) : (
            <>
              {yearInPixels !== 6 && (
                <div
                  className={`${bottomButtonClassName} bg-yellow-400`}
                  onClick={handleResetYearInPixels}
                >
                  Reset Zoom
                </div>
              )}
              {origin !== -1 && destination !== -1 && (
                <AddLink handleAddLink={handleAddLink} />
              )}
              <div
                className={`${bottomButtonClassName} bg-blue-400`}
                onClick={handleTitleClippingToggle}
              >
                Toggle Title
              </div>
              <div
                className={`${bottomButtonClassName} bg-gray-400`}
                onClick={handleToggleIsReligion}
              >
                Toggle Religion
              </div>
              <Storage
                handleSaveData={handleSaveData}
                setEvents={setEvents}
                setPositions={setPositions}
                setWidths={setWidths}
                setOrders={setOrders}
                setOrdersByEventIndex={setOrdersByEventIndex}
                setLinks={setLinks}
                setVisibility={setVisibility}
              />
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
