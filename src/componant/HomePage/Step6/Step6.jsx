import React, { useState } from 'react'
// import TimePicker from 'react-time-picker';

const Step6 = ({ onPrev, onComplete, handlePostData }) => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' });
  });

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleDone = () => {
    onComplete(time);
    handlePostData();
  };

  return (
    <div className='step-container text-white'>
      <div className="text-white">
        <h2>Step 6</h2>
        <p>Notification reminder</p>
      </div>

      <div className="time-picker-container">
        <input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="time-picker"
        />
      </div>
      <div className="mt-5">
        <button onClick={onPrev} className='previous-btn me-4'>Back</button>
        <button onClick={handleDone} className='next-btn'>Done</button>
      </div>
    </div>
  )
}

export default Step6
