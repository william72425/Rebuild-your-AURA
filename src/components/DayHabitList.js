import React, { useState } from 'react';

function DayHabitList({ habits, selectedDate, onUpdateHabitStatus, onDeleteHabit, targetTypes }) {
  const [showValueInput, setShowValueInput] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getTargetTypeInfo = (targetType) => {
    const found = targetTypes?.find(t => t.id === targetType);
    return found || { id: 'boolean', name: 'Yes/No', icon: '✅❌', unit: '' };
  };

  const getHabitStatus = (habit) => {
    const record = (habit.records || []).find(r =>
      new Date(r.date).toDateString() === selectedDateObj.toDateString()
    );
    
    if (!record) {
      return { status: 'no_data', value: null, displayValue: null };
    }
    
    if (record.value === true) {
      return { status: 'completed', value: true, displayValue: '✓' };
    }
    
    if (record.value === false) {
      return { status: 'not_completed', value: false, displayValue: '✗' };
    }
    
    // For numeric values (count, duration, volume, etc.)
    if (typeof record.value === 'number' || typeof record.value === 'string') {
      const targetInfo = getTargetTypeInfo(habit.targetType);
      return { 
        status: 'completed', 
        value: record.value, 
        displayValue: `${record.value} ${targetInfo.unit}` 
      };
    }
    
    return { status: 'no_data', value: null, displayValue: null };
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'completed':
        return { bg: '#e8f5e9', border: '#4CAF50', text: '#2e7d32', icon: '✅' };
      case 'not_completed':
        return { bg: '#ffebee', border: '#f44336', text: '#c62828', icon: '❌' };
      default:
        return { bg: '#f5f5f5', border: '#ccc', text: '#999', icon: '⚪' };
    }
  };

  const handleCompleteWithValue = (habitId, date) => {
    if (habit.targetType !== 'boolean' && !inputValue) {
      setShowValueInput(habitId);
      return;
    }
    
    let value = true;
    if (habit.targetType !== 'boolean') {
      value = habit.targetType === 'time' ? inputValue : parseFloat(inputValue);
    }
    
    onUpdateHabitStatus(habitId, date, 'completed', value);
    setShowValueInput(null);
    setInputValue('');
  };

  const getTargetPlaceholder = (habit) => {
    const info = getTargetTypeInfo(habit.targetType);
    return `Enter ${info.name} (${info.unit})`;
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ color: 'white', marginBottom: '15px' }}>
        📋 {selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </h3>
      
      {habits.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '40px', textAlign: 'center', color: 'white' }}>
          No habits yet. Add your first habit!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {habits.map(habit => {
            const { status, displayValue } = getHabitStatus(habit);
            const style = getStatusStyle(status);
            const targetInfo = getTargetTypeInfo(habit.targetType);
            
            return (
              <div
                key={habit.id}
                style={{
                  background: style.bg,
                  borderRadius: '16px',
                  padding: '16px 20px',
                  borderLeft: `4px solid ${style.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '20px' }}>{style.icon}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '16px', color: style.text }}>{habit.name}</span>
                    {habit.targetType !== 'boolean' && (
                      <span style={{
                        background: '#e0e0e0',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        color: '#666'
                      }}>
                        {targetInfo.icon} {targetInfo.name}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {habit.type} • 🔥 Current streak: <strong style={{ color: '#ff9800' }}>{habit.streak || 0}</strong> days
                    {habit.longestStreak > 0 && ` • Best: ${habit.longestStreak}`}
                  </div>
                  {habit.targetType !== 'boolean' && habit.targetValue && (
                    <div style={{ fontSize: '11px', color: '#2196F3', marginTop: '4px' }}>
                      🎯 Target: {habit.targetValue} {targetInfo.unit}
                    </div>
                  )}
                  {displayValue && habit.targetType !== 'boolean' && (
                    <div style={{ fontSize: '11px', color: '#4CAF50', marginTop: '2px' }}>
                      📊 Today: {displayValue}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {status !== 'completed' && (
                    <>
                      {showValueInput === habit.id && habit.targetType !== 'boolean' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type={habit.targetType === 'time' ? 'time' : 'number'}
                            step="0.1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={getTargetPlaceholder(habit)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #ddd',
                              width: '120px'
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => handleCompleteWithValue(habit.id, selectedDateObj)}
                            style={{
                              padding: '8px 16px',
                              background: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: 'bold'
                            }}
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={() => setShowValueInput(null)}
                            style={{
                              padding: '8px 16px',
                              background: '#999',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (habit.targetType !== 'boolean') {
                              setShowValueInput(habit.id);
                            } else {
                              onUpdateHabitStatus(habit.id, selectedDateObj, 'completed');
                            }
                          }}
                          style={{
                            padding: '8px 16px',
                            background: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 'bold'
                          }}
                        >
                          ✓ {habit.targetType !== 'boolean' ? `Add ${targetInfo.name}` : 'Complete'}
                        </button>
                      )}
                    </>
                  )}
                  
                  {status !== 'not_completed' && (
                    <button
                      onClick={() => onUpdateHabitStatus(habit.id, selectedDateObj, 'not_completed')}
                      style={{
                        padding: '8px 16px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      ✗ Not Complete
                    </button>
                  )}
                  
                  {status !== 'no_data' && (
                    <button
                      onClick={() => onUpdateHabitStatus(habit.id, selectedDateObj, 'no_data')}
                      style={{
                        padding: '8px 16px',
                        background: '#999',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      ↺ Clear
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', color: 'white', fontSize: '12px', textAlign: 'center' }}>
        💡 <strong>How it works:</strong><br />
        ✅ <strong>Yes/No</strong> - Just mark complete<br />
        🔢 <strong>Count/Volume/Duration/Time</strong> - Enter your value when completing<br />
        ❌ Not Complete = You didn't do it (Red)<br />
        ↺ Clear = Remove record (Gray)
      </div>
    </div>
  );
}

export default DayHabitList;
