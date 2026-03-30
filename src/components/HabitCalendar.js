import React, { useState } from 'react';

function HabitCalendar({ habit, onUpdateRecord }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customDate, setCustomDate] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get date string for comparison
  const getDateKey = (date) => {
    return new Date(date).toDateString();
  };

  // Check if habit was completed on a specific date
  const isCompletedOn = (date) => {
    return (habit.records || []).some(r => new Date(r.date).toDateString() === new Date(date).toDateString());
  };

  // Get record value for a specific date
  const getRecordValue = (date) => {
    const record = (habit.records || []).find(r => new Date(r.date).toDateString() === new Date(date).toDateString());
    return record ? record.value : null;
  };

  // Toggle completion for a date
  const toggleCompletion = (date) => {
    const dateStr = new Date(date).toDateString();
    const isCompleted = isCompletedOn(date);
    
    let newRecords;
    if (isCompleted) {
      // Remove record
      newRecords = (habit.records || []).filter(r => new Date(r.date).toDateString() !== dateStr);
    } else {
      // Add record
      newRecords = [...(habit.records || []), { date: new Date(date).toISOString(), value: true }];
    }
    
    onUpdateRecord(habit.id, newRecords);
  };

  // Handle custom date submission
  const handleCustomDate = () => {
    if (customDate) {
      const date = new Date(customDate);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setShowCustomPicker(false);
      }
    }
  };

  // Get dates for different periods
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '20px' }}>📅 {habit.name} - Record History</h3>
      
      {/* Quick Date Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button 
          onClick={() => setSelectedDate(today)}
          style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          📍 Today
        </button>
        <button 
          onClick={() => setSelectedDate(yesterday)}
          style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          ⬅️ Yesterday
        </button>
        <button 
          onClick={() => setSelectedDate(threeDaysAgo)}
          style={{ padding: '8px 16px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          📆 3 days ago
        </button>
        <button 
          onClick={() => setSelectedDate(weekAgo)}
          style={{ padding: '8px 16px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          📅 7 days ago
        </button>
        <button 
          onClick={() => setShowCustomPicker(!showCustomPicker)}
          style={{ padding: '8px 16px', background: '#607D8B', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          📝 Custom Date
        </button>
      </div>

      {/* Custom Date Picker */}
      {showCustomPicker && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '12px' }}>
          <input 
            type="date" 
            value={customDate} 
            onChange={(e) => setCustomDate(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button 
            onClick={handleCustomDate}
            style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Go
          </button>
        </div>
      )}

      {/* Selected Date Display */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        background: isCompletedOn(selectedDate) ? '#e8f5e9' : '#fff3e0', 
        borderRadius: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>
          {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>
          {isCompletedOn(selectedDate) ? '✅' : '❌'}
        </div>
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          {isCompletedOn(selectedDate) ? 'Completed!' : 'Not completed yet'}
        </div>
        <button 
          onClick={() => toggleCompletion(selectedDate)}
          style={{ 
            padding: '12px 24px', 
            background: isCompletedOn(selectedDate) ? '#f44336' : '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {isCompletedOn(selectedDate) ? '✗ Mark as Incomplete' : '✓ Mark as Complete'}
        </button>
      </div>

      {/* Recent Activity Summary */}
      <div style={{ marginTop: '20px' }}>
        <h4>📊 Recent Activity</h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4, 5, 6].map(offset => {
            const date = new Date();
            date.setDate(date.getDate() - offset);
            const completed = isCompletedOn(date);
            return (
              <div key={offset} style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: '45px', 
                  height: '45px', 
                  background: completed ? '#4CAF50' : '#e0e0e0', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontSize: '12px', color: completed ? 'white' : '#666' }}>
                    {date.getDate()}
                  </span>
                </div>
                <div style={{ fontSize: '10px', color: '#666' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HabitCalendar;
