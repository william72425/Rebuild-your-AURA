import React, { useState } from 'react';

function HabitEntryModal({ habit, date, onSave, onClose }) {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const getInputType = () => {
    switch(habit.targetType) {
      case 'time': return 'time';
      case 'duration': return 'number';
      case 'volume': return 'number';
      case 'count': return 'number';
      case 'distance': return 'number';
      case 'pages': return 'number';
      default: return 'text';
    }
  };

  const getPlaceholder = () => {
    switch(habit.targetType) {
      case 'time': return 'e.g., 22:30';
      case 'duration': return `minutes (${habit.targetUnit || 'min'})`;
      case 'volume': return `litres (${habit.targetUnit || 'L'})`;
      case 'count': return `times (${habit.targetUnit || 'times'})`;
      case 'distance': return `km (${habit.targetUnit || 'km'})`;
      case 'pages': return `pages (${habit.targetUnit || 'pages'})`;
      default: return 'Enter value';
    }
  };

  const getUnitDisplay = () => {
    const units = {
      time: '',
      duration: habit.targetUnit || 'min',
      volume: habit.targetUnit || 'L',
      count: habit.targetUnit || 'times',
      distance: habit.targetUnit || 'km',
      pages: habit.targetUnit || 'pages'
    };
    return units[habit.targetType] || '';
  };

  const handleSave = () => {
    let finalValue = value;
    if (habit.targetType === 'duration' || habit.targetType === 'volume' || 
        habit.targetType === 'count' || habit.targetType === 'distance' || 
        habit.targetType === 'pages') {
      finalValue = parseFloat(value);
    }
    onSave(habit.id, date, finalValue, notes);
    onClose();
  };

  const dateStr = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '28px',
        maxWidth: '450px',
        width: '90%'
      }}>
        <h2 style={{ marginBottom: '8px' }}>{habit.name}</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>{dateStr}</p>

        {habit.targetType !== 'boolean' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
              Enter {habit.targetType.charAt(0).toUpperCase() + habit.targetType.slice(1)}:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type={getInputType()}
                step={habit.targetType === 'duration' ? '1' : '0.1'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getPlaceholder()}
                style={{
                  flex: 2,
                  padding: '12px',
                  fontSize: '16px',
                  borderRadius: '10px',
                  border: '1px solid #ddd'
                }}
                autoFocus
              />
              {getUnitDisplay() && (
                <span style={{ flex: 1, color: '#666' }}>{getUnitDisplay()}</span>
              )}
            </div>
            {habit.targetValue && (
              <div style={{ fontSize: '12px', color: '#2196F3', marginTop: '8px' }}>
                🎯 Target: {habit.targetValue} {getUnitDisplay()}
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
            Notes (optional):
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            rows="3"
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '12px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Save Entry
          </button>
          <button
            onClick={() => onUpdateHabitStatus(habit.id, date, 'not_completed')}
            style={{
              flex: 1,
              padding: '12px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Mark Not Done
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              background: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitEntryModal;
