import React from 'react';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  VisibilityOff,
  Visibility,
} from '@material-ui/icons';

export const Hidden = ({ events, visibility, handleUnhideEvent }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const handleToggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const [hoverIndex, setHoverIndex] = React.useState(-1);
  const [isHover, setIsHover] = React.useState(false);
  const handleOnHover = index => {
    setIsHover(true);
    setHoverIndex(index);
  };
  const handleOnDishover = () => {
    setIsHover(false);
  };

  return (
    <div className="flex flex-col items-stretch w-[250px] rounded-lg bg-white shadow-lg">
      <div className="py-2 px-4 text-center">Hidden events</div>
      <hr />
      {isOpen &&
        events
          .map((_, eventIndex) => eventIndex)
          .filter(eventIndex => !visibility[eventIndex])
          .map(eventIndex => {
            const { description } = events[eventIndex];

            return (
              <div
                className="py-2 px-4 flex items-center cursor-pointer text-[14px] hover:bg-gray-100"
                onClick={() => handleUnhideEvent(eventIndex)}
                onMouseOver={() => handleOnHover(eventIndex)}
                onMouseLeave={handleOnDishover}
              >
                {isHover && eventIndex === hoverIndex ? (
                  <Visibility className="mr-2" fontSize="inherit" />
                ) : (
                  <VisibilityOff className="mr-2" fontSize="inherit" />
                )}
                <div className="truncate">{description}</div>
              </div>
            );
          })}

      {isOpen && <hr />}

      <div
        className="cursor-pointer text-center hover:bg-gray-100"
        onClick={handleToggleIsOpen}
      >
        {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </div>
    </div>
  );
};
