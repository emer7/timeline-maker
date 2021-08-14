import React from 'react';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import {
  calculateStartDuration,
  convertToHumanDate,
  parseMultipleFormat,
  parseNumericalFullDate,
} from '../utils';
import { WIDTH } from '../consts';

export const Popup = ({
  scrollTop,
  yearInPixels,
  minStartDate,
  selectedEvent,
  left,
  handleDeleteEvent,
  handleEditEvent,
  handleChildrenVisibility,
}) => {
  const [popupEvent, setPopupEvent] = React.useState(selectedEvent);
  React.useEffect(() => {
    setPopupEvent(selectedEvent);
  }, [selectedEvent]);
  const handleEditPopupEvent = (e, key) => {
    setPopupEvent({ ...popupEvent, [key]: e.target.value });
  };
  const handleSaveEvent = () => {
    handleEditEvent(popupEvent);
    setIsEdit(false);
  };

  const [isEdit, setIsEdit] = React.useState(false);
  const handleToggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const {
    description,
    startDate,
    endDate,
    reignStartDate,
    reignEndDate,
    children,
  } = popupEvent;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(startDate);

  const top = calculateStartDuration(
    parsedMinStartDate,
    parsedStartDate,
    yearInPixels
  );

  const handleToggleChildrenVisibility = () => {
    handleChildrenVisibility(children);
  };

  return (
    <div
      className="relative inline-block p-2 rounded-r-lg shadow bg-white"
      style={{ top: top - scrollTop, left: Math.max(WIDTH, left + WIDTH / 2) }}
    >
      <DeleteIcon
        className="float-right cursor-pointer"
        onClick={handleDeleteEvent}
      />
      <EditIcon
        className="float-right cursor-pointer"
        onClick={handleToggleEdit}
      />
      {isEdit ? (
        <>
          <SaveIcon
            className="float-right cursor-pointer"
            onClick={handleSaveEvent}
          />
          <input
            className="block clear-right"
            value={description}
            onChange={e => handleEditPopupEvent(e, 'description')}
          />
          <div>
            Start date:{' '}
            <input
              className="block clear-right"
              value={startDate}
              onChange={e => handleEditPopupEvent(e, 'startDate')}
            />
          </div>
          {endDate && (
            <div>
              End date:{' '}
              <input
                className="block clear-right"
                value={endDate}
                onChange={e => handleEditPopupEvent(e, 'endDate')}
              />
            </div>
          )}
          {reignStartDate && (
            <div>
              Reign start date:{' '}
              <input
                className="block clear-right"
                value={reignStartDate}
                onChange={e => handleEditPopupEvent(e, 'reignStartDate')}
              />
            </div>
          )}
          {reignEndDate && (
            <div>
              Reign end date:{' '}
              <input
                className="block clear-right"
                value={reignEndDate}
                onChange={e => handleEditPopupEvent(e, 'reignEndDate')}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-2 font-bold clear-right">{description}</div>
          <div>
            Start date: <br />
            {convertToHumanDate(startDate)}
          </div>
          {endDate && (
            <div>
              End date: <br />
              {convertToHumanDate(endDate)}
            </div>
          )}
          {reignStartDate && (
            <div>
              Reign start date: <br />
              {convertToHumanDate(reignStartDate)}
            </div>
          )}
          {reignEndDate && (
            <div>
              Reign end date: <br />
              {convertToHumanDate(reignEndDate)}
            </div>
          )}
          {children && (
            <button onClick={handleToggleChildrenVisibility}>
              toggle children
            </button>
          )}
        </>
      )}
    </div>
  );
};
