import React from 'react';
import {
  DeleteOutlined as DeleteIcon,
  EditOutlined as EditIcon,
  SaveOutlined as SaveIcon,
  PaletteOutlined as PaletteIcon,
  AccountTreeOutlined as GroupIcon,
} from '@material-ui/icons';

import {
  calculateDuration,
  convertToHumanDate,
  parseMultipleFormat,
  parseNumericalFullDate,
} from '../utils';
import { WIDTH, PALETTE } from '../consts';

import { ColorPicker } from './ColorPicker';

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
  const handleDescriptionChange = e => {
    handleEditPopupEvent(e, 'description');
  };
  const handleStartDateChange = e => {
    handleEditPopupEvent(e, 'startDate');
  };
  const handleEndDateChange = e => {
    handleEditPopupEvent(e, 'endDate');
  };
  const handleReignStartDateChange = e => {
    handleEditPopupEvent(e, 'reignStartDate');
  };
  const handleReignEndDateChange = e => {
    handleEditPopupEvent(e, 'reignEndDate');
  };
  const handleOnColorChange = newColor => {
    const editedPopupEvent = { ...popupEvent, color: newColor.hex };

    handleEditEvent(editedPopupEvent);
  };

  const handleOnClickDelete = e => {
    e.stopPropagation();
    handleDeleteEvent();
  };

  const handleSaveEvent = e => {
    e.stopPropagation();
    handleEditEvent(popupEvent);
    setIsEdit(false);
  };

  const [isEdit, setIsEdit] = React.useState(false);
  const handleToggleEdit = e => {
    e.stopPropagation();
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
    type,
  } = popupEvent;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(startDate);

  const top = calculateDuration(
    parsedMinStartDate,
    parsedStartDate,
    yearInPixels
  );

  const handleToggleChildrenVisibility = e => {
    e.stopPropagation();
    handleChildrenVisibility(children);
  };

  const [isColorPicker, setIsColorPicker] = React.useState(false);
  const handleToggleColorPicker = e => {
    setIsColorPicker(!isColorPicker);
  };

  return (
    <div
      className="relative inline-flex flex-col space-y-4"
      style={{
        top: top - scrollTop,
        left: Math.max(WIDTH, left + WIDTH / 2) + 16,
      }}
    >
      {isColorPicker && (
        <ColorPicker color={color} onChangeComplete={handleOnColorChange} />
      )}

      <div className="inline-block rounded-lg bg-white shadow-lg overflow-hidden">
        <div
          className="flex justify-end p-2 cursor-pointer"
          style={{
            backgroundColor:
              color || (type === 'event' ? PALETTE[4] : PALETTE[10]),
          }}
          onClick={handleToggleColorPicker}
        >
          {isEdit && (
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600"
              onClick={handleSaveEvent}
            >
              <SaveIcon className="cursor-pointer text-white" />
            </div>
          )}
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600"
            onClick={handleToggleEdit}
          >
            <EditIcon className="cursor-pointer text-white" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600">
            <PaletteIcon className="cursor-pointer text-white" />
          </div>
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600"
            onClick={handleOnClickDelete}
          >
            <DeleteIcon className="cursor-pointer text-white" />
          </div>
          {children && (
            <div className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600">
              <GroupIcon
                className="cursor-pointer text-white"
                onClick={handleToggleChildrenVisibility}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-1 p-2">
          <input
            className={`py-2 px-3 focus:outline-none rounded-lg font-bold ${
              isEdit ? 'bg-gray-100' : 'bg-white'
            }`}
            value={description}
            onChange={handleDescriptionChange}
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
                onChange={handleStartDateChange}
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
                  onChange={handleEndDateChange}
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
                    onChange={handleReignStartDateChange}
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
                    onChange={handleReignEndDateChange}
                    disabled={!isEdit}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
