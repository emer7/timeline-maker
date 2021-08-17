import React from 'react';
import { format } from 'date-fns';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Palette as PaletteIcon,
} from '@material-ui/icons';
import { animated, useTransition, useSpring } from 'react-spring';

import { HUMAN_FULL_DATE_FORMAT, PALETTE } from '../consts';
import { convertToNumericalDate } from '../utils';

import { ColorPicker } from './ColorPicker';

const convertEventDateToNumerical = event => ({
  ...event,
  ...Object.keys(event)
    .filter(key => key.includes('Date'))
    .reduce(
      (newDates, key) => ({
        ...newDates,
        [key]: convertToNumericalDate(event[key]),
      }),
      {}
    ),
});

export const Add = ({ handleAddEvent }) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setIsPopupOpen(!isPopupOpen);
    setIsColorPicker(false);
  };

  const popupTransition = useTransition(isPopupOpen, {
    from: { opacity: 0, transform: 'translateY(100%)' },
    enter: { opacity: 1, transform: 'translateY(0%)' },
    leave: { opacity: 0, transform: 'translateY(100%)' },
    reverse: isPopupOpen,
  });

  const buttonRotation = useSpring({
    transform: `rotate(${isPopupOpen ? 45 : 0}deg)`,
  });

  const [dates, setDates] = React.useState({
    startDate: '',
    endDate: '',
  });
  const handleStartDateChange = e => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    setDates({ ...dates, startDate: trimmedValue, endDate: trimmedValue });
  };
  const handleEndDateChange = e => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    setDates({ ...dates, endDate: trimmedValue });
  };
  const handleSetPlaceholderAsValue = () => {
    setDates({
      ...dates,
      startDate: format(new Date(), HUMAN_FULL_DATE_FORMAT),
      endDate: format(new Date(), HUMAN_FULL_DATE_FORMAT),
    });
  };

  const handleReignStartDateChange = e => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    setDates({
      ...dates,
      reignStartDate: trimmedValue,
      reignEndDate: trimmedValue,
    });

    trimmedValue ? setColor(PALETTE[10]) : setColor(PALETTE[16]);
  };
  const handleReignEndDateChange = e => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    setDates({ ...dates, reignEndDate: trimmedValue });

    trimmedValue
      ? setColor(PALETTE[10])
      : !dates.reignStartDate && setColor(PALETTE[16]);
  };

  const [description, setDescription] = React.useState('');
  const handleDescriptionChange = e => {
    const { value } = e.target;
    const trimmedValue = value.trim();

    setDescription(trimmedValue);
  };

  const [type, setType] = React.useState('people');
  const handleTypeChange = e => {
    const newType = e.target.value;

    setType(newType);

    if (newType === 'event') {
      const { startDate, endDate } = dates;
      setDates({
        startDate,
        endDate,
      });
      setColor(PALETTE[16]);
    }
  };

  const handleOnClickAddButton = () => {
    const event = {
      ...Object.keys(dates)
        .filter(key => !!dates[key])
        .reduce((newDates, key) => ({ ...newDates, [key]: dates[key] }), {}),
      description,
      type,
      color,
    };

    handleAddEvent(convertEventDateToNumerical(event));
  };

  const [isColorPicker, setIsColorPicker] = React.useState(false);
  const handleToggleColorPicker = e => {
    setIsColorPicker(!isColorPicker);
  };

  const [color, setColor] = React.useState(PALETTE[16]);
  const handleOnColorChange = newColor => {
    setColor(newColor.hex);
  };

  const { startDate, endDate, reignStartDate, reignEndDate } = dates;

  return (
    <>
      <div className="absolute bottom-16 right-0 flex flex-col space-y-4 items-end">
        {isColorPicker && (
          <ColorPicker color={color} onChangeComplete={handleOnColorChange} />
        )}

        {popupTransition(
          (styles, isShown) =>
            isShown && (
              <animated.div
                className="flex flex-col rounded-lg bg-white shadow-lg overflow-hidden"
                style={styles}
              >
                <div
                  className="relative flex items-center justify-center text-white cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={handleToggleColorPicker}
                >
                  <PaletteIcon className="absolute right-4" />
                  <input
                    className="my-2 py-1 px-3 box-border text-center focus:outline-none placeholder-white hover:border-white focus:border-white border-b-2 border-transparent bg-transparent"
                    onChange={handleDescriptionChange}
                    onClick={e => e.stopPropagation()}
                    value={description}
                    placeholder="Add a description"
                  />
                </div>
                <div className="flex flex-col space-y-2 p-4">
                  <div className="flex space-x-1">
                    <input
                      className={`py-2 px-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg ${
                        startDate ? 'bg-gray-100' : ''
                      }`}
                      onChange={handleStartDateChange}
                      onClick={
                        !startDate && !endDate
                          ? handleSetPlaceholderAsValue
                          : () => {}
                      }
                      value={startDate}
                      placeholder="Add start date"
                    />
                    <input
                      className={`py-2 px-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg ${
                        endDate ? 'bg-gray-100' : ''
                      }`}
                      onChange={handleEndDateChange}
                      onClick={
                        !startDate && !endDate
                          ? handleSetPlaceholderAsValue
                          : () => {}
                      }
                      value={endDate}
                      placeholder="Add end date"
                    />
                  </div>
                  {type === 'people' && (
                    <div className="flex space-x-1">
                      <input
                        className={`py-2 px-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg ${
                          reignStartDate || '' ? 'bg-gray-100' : ''
                        }`}
                        onChange={handleReignStartDateChange}
                        value={reignStartDate || ''}
                        placeholder="Add reign start date"
                      />
                      <input
                        className={`py-2 px-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg ${
                          reignEndDate || '' ? 'bg-gray-100' : ''
                        }`}
                        onChange={handleReignEndDateChange}
                        value={reignEndDate || ''}
                        placeholder="Add reign end date"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {type === 'event' ? <EventIcon /> : <PeopleIcon />}
                    <select
                      className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none cursor-pointer w-full"
                      onChange={handleTypeChange}
                      value={type}
                    >
                      <option value="event">Event</option>
                      <option value="people">People</option>
                    </select>
                  </div>

                  <button
                    className="py-1 w-full text-white bg-blue-400 rounded-lg"
                    onClick={handleOnClickAddButton}
                  >
                    Add
                  </button>
                </div>
              </animated.div>
            )
        )}
      </div>

      <animated.div
        className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer text-white bg-gray-600"
        style={buttonRotation}
        onClick={handleDrawerToggle}
      >
        <AddIcon />
      </animated.div>
    </>
  );
};
