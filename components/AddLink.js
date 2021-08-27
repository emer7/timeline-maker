import React from 'react';

export const AddLink = ({ handleAddLink }) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const buttonRef = React.useRef();

  const bottomButtonClassName =
    'px-8 h-12 flex items-center justify-center rounded-full cursor-pointer select-none text-white';

  return (
    <>
      {isPopupOpen && (
        <div
          className="absolute bottom-16"
          style={{ left: buttonRef.current.offsetLeft }}
        >
          <div className="flex flex-col rounded-2xl bg-white shadow-lg overflow-hidden">
            <div
              className="p-4 text-center cursor-pointer hover:bg-gray-200 border-b-2"
              onClick={() => handleAddLink('continuation')}
            >
              Continuation
            </div>
            <div
              className="p-4 text-center cursor-pointer hover:bg-gray-200"
              onClick={() => handleAddLink('termination')}
            >
              Termination
            </div>
          </div>
        </div>
      )}

      <div
        ref={buttonRef}
        className={`${bottomButtonClassName} bg-red-400`}
        onClick={handlePopupToggle}
      >
        Link
      </div>
    </>
  );
};
