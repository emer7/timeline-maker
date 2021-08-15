import React from 'react';

import { format } from 'date-fns';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Subject as SubjectIcon,
} from '@material-ui/icons';
import { animated, useTransition, useSpring } from 'react-spring';

import { HUMAN_FULL_DATE_FORMAT } from '../consts';
import { convertToNumericalDate } from '../utils';

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
    setDates({ ...dates, startDate: e.target.value, endDate: e.target.value });
  };
  const handleEndDateChange = e => {
    setDates({ ...dates, endDate: e.target.value });
  };
  const handleSetPlaceholderAsValue = () => {
    setDates({
      ...dates,
      startDate: format(new Date(), HUMAN_FULL_DATE_FORMAT),
      endDate: format(new Date(), HUMAN_FULL_DATE_FORMAT),
    });
  };

  const handleReignStartDateChange = e => {
    setDates({
      ...dates,
      reignStartDate: e.target.value,
      reignEndDate: e.target.value,
    });
  };
  const handleReignEndDateChange = e => {
    setDates({ ...dates, reignEndDate: e.target.value });
  };

  const [description, setDescription] = React.useState('');
  const handleDescriptionChange = e => {
    setDescription(e.target.value);
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
    }
  };

  const handleOnClickAddButton = () => {
    const event = {
      ...Object.keys(dates)
        .filter(key => !!dates[key])
        .reduce((newDates, key) => ({ ...newDates, [key]: dates[key] }), {}),
      description,
      type,
    };

    handleAddEvent(convertEventDateToNumerical(event));
  };

  const { startDate, endDate, reignStartDate, reignEndDate } = dates;

  return (
    <>
      {popupTransition(
        (styles, isShown) =>
          isShown && (
            <animated.div
              className="absolute bottom-16 right-0 p-4 flex flex-col space-y-2 rounded-lg bg-white shadow-lg"
              style={styles}
            >
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
                <SubjectIcon />
                <input
                  className={`py-2 px-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none rounded-lg w-full ${
                    description ? 'bg-gray-100' : ''
                  }`}
                  onChange={handleDescriptionChange}
                  value={description}
                  placeholder="Add a description"
                />
              </div>

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
            </animated.div>
          )
      )}

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
