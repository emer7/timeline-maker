import React from 'react';

import { format } from 'date-fns';
import { Add as AddIcon } from '@material-ui/icons';

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

  const handleOnClick = () => {
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
      {isPopupOpen && (
        <div className="absolute bottom-16 right-0 p-4 flex flex-col rounded-lg bg-white">
          <div className="flex">
            <input
              onChange={handleStartDateChange}
              onClick={handleSetPlaceholderAsValue}
              value={startDate}
              placeholder={format(new Date(), HUMAN_FULL_DATE_FORMAT)}
            />
            <input
              onChange={handleEndDateChange}
              onClick={handleSetPlaceholderAsValue}
              value={endDate}
              placeholder={format(new Date(), HUMAN_FULL_DATE_FORMAT)}
            />
          </div>
          {type === 'people' && (
            <div className="flex">
              <input
                onChange={handleReignStartDateChange}
                value={reignStartDate || ''}
              />
              <input
                onChange={handleReignEndDateChange}
                value={reignEndDate || ''}
              />
            </div>
          )}
          <input onChange={handleDescriptionChange} value={description} />

          <select onChange={handleTypeChange} value={type}>
            <option value="event">Event</option>
            <option value="people">People</option>
          </select>

          <button onClick={handleOnClick}>Add</button>
        </div>
      )}

      <div
        className="w-12 h-12 flex items-center justify-center rounded-full cursor-pointer text-white bg-gray-600"
        onClick={handleDrawerToggle}
      >
        <AddIcon />
      </div>
    </>
  );
};
