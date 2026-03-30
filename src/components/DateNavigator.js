import React from 'react';

function DateNavigator({ currentDate, onDateChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goPrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const goNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= today) {
      onDateChange(newDate);
    }
  };

  const goToday = () => {
    onDateChange(new Date());
  };

  const isNextDisabled = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    return nextDate > today;
  };

  const formatDate = (date) => {
    const todayDate = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === todayDate.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '15px 20px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <button
        onClick={goPrevDay}
        style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        ◀ Previous Day
      </button>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
          {formatDate(currentDate)}
        </div>
        <button
          onClick={goToday}
          style={{
            marginTop: '5px',
            padding: '4px 12px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          📍 Go to Today
        </button>
      </div>

      <button
        onClick={goNextDay}
        disabled={isNextDisabled()}
        style={{
          padding: '10px 20px',
          background: isNextDisabled() ? '#ccc' : '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: isNextDisabled() ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        Next Day ▶
      </button>
    </div>
  );
}

export default DateNavigator;
