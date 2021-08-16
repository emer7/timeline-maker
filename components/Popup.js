import React from 'react';
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SaveOutlined as SaveIcon,
} from '@material-ui/icons';

import {
  calculateDuration,
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
    color,
  } = popupEvent;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(startDate);

  const top = calculateDuration(
    parsedMinStartDate,
    parsedStartDate,
    yearInPixels
  );

  const handleToggleChildrenVisibility = () => {
    handleChildrenVisibility(children);
  };

  return (
    <div
      className="relative inline-block rounded-lg bg-white shadow-lg overflow-hidden"
      style={{
        top: top - scrollTop,
        left: Math.max(WIDTH, left + WIDTH / 2) + 16,
      }}
    >
      <div
        className="flex justify-end p-2"
        style={{ backgroundColor: color || 'gray' }}
      >
        {isEdit && (
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600"
            onClick={handleSaveEvent}
          >
            <SaveIcon className="cursor-pointer text-gray-200" />
          </div>
        )}
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600"
          onClick={handleToggleEdit}
        >
          <EditIcon className="cursor-pointer text-gray-200" />
        </div>
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600"
          onClick={handleDeleteEvent}
        >
          <DeleteIcon className="cursor-pointer text-gray-200" />
        </div>
      </div>

      <div className="flex flex-col space-y-1 p-2">
        <input
          className={`py-2 px-3 focus:outline-none rounded-lg font-bold ${
            isEdit ? 'bg-gray-100' : 'bg-white'
          }`}
          value={description}
          onChange={e => handleEditPopupEvent(e, 'description')}
          disabled={!isEdit}
        />

        <div className="flex space-x-2">
          <div className="flex flex-col">
            <div className="pl-3 font-medium">Start date</div>
            <input
              className={`py-2 px-3 focus:outline-none rounded-lg ${
                isEdit ? 'bg-gray-100' : 'bg-white'
              }`}
              value={convertToHumanDate(startDate)}
              onChange={e => handleEditPopupEvent(e, 'startDate')}
              disabled={!isEdit}
            />
          </div>

          {endDate && (
            <div className="flex flex-col">
              <div className="pl-3 font-medium">End date</div>
              <input
                className={`py-2 px-3 focus:outline-none rounded-lg ${
                  isEdit ? 'bg-gray-100' : 'bg-white'
                }`}
                value={convertToHumanDate(endDate)}
                onChange={e => handleEditPopupEvent(e, 'endDate')}
                disabled={!isEdit}
              />
            </div>
          )}
        </div>

        {(reignStartDate || reignEndDate) && (
          <div className="flex space-x-2">
            {reignStartDate && (
              <div className="flex flex-col">
                <div className="pl-3 font-medium">Reign start date</div>
                <input
                  className={`py-2 px-3 focus:outline-none rounded-lg ${
                    isEdit ? 'bg-gray-100' : 'bg-white'
                  }`}
                  value={convertToHumanDate(reignStartDate)}
                  onChange={e => handleEditPopupEvent(e, 'reignStartDate')}
                  disabled={!isEdit}
                />
              </div>
            )}

            {reignEndDate && (
              <div className="flex flex-col">
                <div className="pl-3 font-medium">Reign end date</div>
                <input
                  className={`py-2 px-3 focus:outline-none rounded-lg ${
                    isEdit ? 'bg-gray-100' : 'bg-white'
                  }`}
                  value={convertToHumanDate(reignEndDate)}
                  onChange={e => handleEditPopupEvent(e, 'reignEndDate')}
                  disabled={!isEdit}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
