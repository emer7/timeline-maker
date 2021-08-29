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
  trimEventProperties,
} from '../utils';
import { getFontWhiteOrBlack } from '../utils/color';
import {
  WIDTH,
  PALETTE,
  RELIGION_OPTIONS,
  TYPE_OPTIONS,
  RELIGION_PALETTE,
} from '../consts';

import { ColorPicker } from './ColorPicker';

export const Popup = ({
  scrollTop,
  scrollLeft,
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
    const { value } = e.target;

    setPopupEvent({ ...popupEvent, [key]: value });
  };
  const handleDescriptionChange = e => {
    handleEditPopupEvent(e, 'description');
  };
  const handleTypeChange = e => {
    handleEditPopupEvent(e, 'type');
  };
  const handleReligionChange = e => {
    const { value } = e.target;

    if (value) {
      handleEditPopupEvent(e, 'religion');
    } else {
      const copiedPopupEvent = { ...popupEvent };
      delete copiedPopupEvent.religion;

      setPopupEvent(copiedPopupEvent);
    }
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

    handleEditEvent(trimEventProperties(editedPopupEvent));
    handleToggleColorPicker();
  };

  const handleToggleChildrenVisibility = e => {
    e.stopPropagation();
    handleChildrenVisibility(children);
  };

  const handleOnClickDelete = e => {
    e.stopPropagation();
    handleDeleteEvent();
  };

  const handleSaveEvent = e => {
    e.stopPropagation();

    handleEditEvent(trimEventProperties(popupEvent));
    setIsEdit(false);
  };

  const [isEdit, setIsEdit] = React.useState(false);
  const handleToggleEdit = e => {
    e.stopPropagation();
    setIsEdit(!isEdit);
  };

  const {
    description,
    type,
    religion = '',
    startDate,
    endDate,
    reignStartDate,
    reignEndDate,
    children,
    color = reignStartDate && reignEndDate ? PALETTE[10] : PALETTE[16],
  } = popupEvent;

  const { startDate: selectedStartDate } = selectedEvent;

  const parsedMinStartDate = parseNumericalFullDate(minStartDate);
  const parsedStartDate = parseMultipleFormat(selectedStartDate);

  const top = calculateDuration(
    parsedMinStartDate,
    parsedStartDate,
    yearInPixels
  );

  const [isColorPicker, setIsColorPicker] = React.useState(false);
  const handleToggleColorPicker = e => {
    setIsColorPicker(!isColorPicker);
  };

  const popupActionButtonClassName =
    'w-8 h-8 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-600';

  const popupSelectClassName = `p-2 rounded-full focus:outline-none cursor-pointer bg-gray-100`;
  const tagClassName = `px-3 py-1.5 rounded-full focus:outline-none cursor-pointer bg-gray-100`;

  const popupInputClassName = `py-2 px-3 focus:outline-none rounded-lg ${
    isEdit ? 'bg-gray-100' : 'bg-white'
  }`;

  const isBlackOrWhite = getFontWhiteOrBlack(color);

  return (
    <div
      className="relative inline-flex flex space-x-4 items-start"
      style={{
        top: top - scrollTop,
        left: left + WIDTH / 2 + 16 - scrollLeft,
      }}
    >
      <div className="inline-block rounded-lg bg-white shadow-lg overflow-hidden">
        <div
          className={`flex space-x-4 justify-between p-2 cursor-pointer ${
            isBlackOrWhite === 'black' ? 'text-black' : 'text-white'
          }`}
          style={{
            backgroundColor: color,
          }}
          onClick={handleToggleColorPicker}
        >
          <input
            className={`ml-1 py-1 box-border border-b-2 border-transparent focus:outline-none bg-transparent w-full ${
              isEdit ? 'border-black' : ''
            }`}
            value={description}
            onChange={handleDescriptionChange}
            disabled={!isEdit}
          />
          <div className="flex">
            {isEdit && (
              <div
                className={popupActionButtonClassName}
                onClick={handleSaveEvent}
              >
                <SaveIcon />
              </div>
            )}
            <div
              className={popupActionButtonClassName}
              onClick={handleToggleEdit}
            >
              <EditIcon />
            </div>
            <div
              className={popupActionButtonClassName}
              onClick={handleOnClickDelete}
            >
              <DeleteIcon />
            </div>
            {children && (
              <div className={popupActionButtonClassName}>
                <GroupIcon onClick={handleToggleChildrenVisibility} />
              </div>
            )}
            <div className={popupActionButtonClassName}>
              <PaletteIcon />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 p-2">
          <div className="flex space-x-2">
            <div className="flex flex-col">
              <div className="pl-3 font-medium">Start date</div>
              <input
                className={popupInputClassName}
                value={convertToHumanDate(startDate)}
                onChange={handleStartDateChange}
                disabled={!isEdit}
              />
            </div>

            {endDate && (
              <div className="flex flex-col">
                <div className="pl-3 font-medium">End date</div>
                <input
                  className={popupInputClassName}
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
                    className={popupInputClassName}
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
                    className={popupInputClassName}
                    value={convertToHumanDate(reignEndDate)}
                    onChange={handleReignEndDateChange}
                    disabled={!isEdit}
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-2">
            {isEdit ? (
              <>
                <select
                  className={popupSelectClassName}
                  onChange={handleTypeChange}
                  value={type}
                >
                  {Object.entries(TYPE_OPTIONS).map(
                    ([optionValue, optionDisplay]) => (
                      <option key={optionValue} value={optionValue}>
                        {optionDisplay}
                      </option>
                    )
                  )}
                </select>
                <select
                  className={popupSelectClassName}
                  style={{
                    backgroundColor: RELIGION_PALETTE[religion],
                  }}
                  onChange={handleReligionChange}
                  value={religion}
                >
                  {Object.entries(RELIGION_OPTIONS).map(
                    ([optionValue, optionDisplay]) => (
                      <option key={optionValue} value={optionValue}>
                        {optionDisplay}
                      </option>
                    )
                  )}
                </select>
              </>
            ) : (
              <>
                <div className={tagClassName}>{TYPE_OPTIONS[type]}</div>
                <div
                  className={tagClassName}
                  style={{
                    backgroundColor: RELIGION_PALETTE[religion],
                  }}
                >
                  {RELIGION_OPTIONS[religion]}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isColorPicker && (
        <ColorPicker color={color} onChangeComplete={handleOnColorChange} />
      )}
    </div>
  );
};
