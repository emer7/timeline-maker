import React from 'react';

export const Storage = ({ handleSaveData }) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleDownloadAsJson = () => {
    const events = JSON.parse(localStorage.getItem('events'));
    const positions = JSON.parse(localStorage.getItem('positions'));
    const orders = JSON.parse(localStorage.getItem('orders'));
    const ordersByEventIndex = JSON.parse(
      localStorage.getItem('ordersByEventIndex')
    );
    const links = JSON.parse(localStorage.getItem('links'));

    const blob = new Blob(
      [
        JSON.stringify({
          events,
          positions,
          orders,
          ordersByEventIndex,
          links,
        }),
      ],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.download = 'backup.json';
    a.href = url;
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
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
              onClick={handleDownloadAsJson}
            >
              Download as JSON
            </div>
            <div
              className="p-4 text-center cursor-pointer hover:bg-gray-200"
              onClick={handleSaveData}
            >
              Save
            </div>
          </div>
        </div>
      )}

      <div
        ref={buttonRef}
        className={`${bottomButtonClassName} bg-blue-400`}
        onClick={handlePopupToggle}
      >
        Storage
      </div>
    </>
  );
};
