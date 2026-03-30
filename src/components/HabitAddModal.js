import React, { useState } from 'react';

function HabitAddModal({ onSave, onClose }) {
  const [habit, setHabit] = useState({
    name: '',
    category: 'health',
    type: 'daily',
    targetType: 'boolean',
    targetValue: '',
    targetUnit: '',
    targetComparison: '>=',
    targetMin: '',
    targetMax: ''
  });

  const categories = [
    { id: 'health', name: 'Health', icon: '💪' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'custom', name: 'Custom', icon: '✨' }
  ];

  const targetTypes = [
    { id: 'boolean', name: 'Yes/No', icon: '✅❌', description: 'Just mark complete or not', needsUnit: false, needsValue: false },
    { id: 'count', name: 'Count', icon: '🔢', description: 'Pushups, reps, times', needsUnit: true, unitPlaceholder: 'times, reps', needsValue: true },
    { id: 'duration', name: 'Duration', icon: '⏱️', description: 'Minutes, hours', needsUnit: true, unitPlaceholder: 'minutes, hours', needsValue: true },
    { id: 'volume', name: 'Volume', icon: '💧', description: 'Water, liquid intake', needsUnit: true, unitPlaceholder: 'litres, ml, bottles', needsValue: true },
    { id: 'distance', name: 'Distance', icon: '🏃', description: 'Running, walking, cycling', needsUnit: true, unitPlaceholder: 'km, miles', needsValue: true },
    { id: 'pages', name: 'Pages', icon: '📖', description: 'Reading pages', needsUnit: true, unitPlaceholder: 'pages, chapters', needsValue: true },
    { id: 'time', name: 'Time', icon: '⏰', description: 'Bedtime, wakeup time', needsUnit: false, needsValue: true },
    { id: 'custom', name: 'Custom', icon: '✨', description: 'Create your own type', needsUnit: true, unitPlaceholder: 'your unit', needsValue: true }
  ];

  const comparisons = [
    { id: '>=', label: 'At least', icon: '≥' },
    { id: '<=', label: 'At most', icon: '≤' },
    { id: '=', label: 'Exactly', icon: '=' },
    { id: 'between', label: 'Between', icon: '↔️' }
  ];

  const selectedType = targetTypes.find(t => t.id === habit.targetType);

  const handleSave = () => {
    if (habit.name.trim()) {
      onSave({
        ...habit,
        id: Date.now(),
        streak: 0,
        longestStreak: 0,
        records: [],
        createdAt: new Date().toISOString(),
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      });
      onClose();
    }
  };

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
      zIndex: 2000,
      overflow: 'auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '28px',
        maxWidth: '550px',
        width: '90%',
        maxHeight: '85vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginBottom: '20px' }}>✨ Create New Habit</h2>

        {/* Habit Name */}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Habit Name:</label>
        <input
          type="text"
          value={habit.name}
          onChange={(e) => setHabit({...habit, name: e.target.value})}
          placeholder="e.g., Morning Meditation, Drink Water, Read Books"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #ddd',
            fontSize: '16px'
          }}
        />

        {/* Category */}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Category:</label>
        <select
          value={habit.category}
          onChange={(e) => setHabit({...habit, category: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #ddd'
          }}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
          ))}
        </select>

        {/* Habit Type */}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Habit Type:</label>
        <select
          value={habit.type}
          onChange={(e) => setHabit({...habit, type: e.target.value})}
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #ddd'
          }}
        >
          <option value="daily">📅 Daily</option>
          <option value="weekly">📆 Weekly</option>
        </select>

        {/* Target Type */}
        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>What are you tracking?</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px', marginBottom: '15px' }}>
          {targetTypes.map(tt => (
            <button
              key={tt.id}
              type="button"
              onClick={() => setHabit({
                ...habit,
                targetType: tt.id,
                targetValue: '',
                targetUnit: '',
                targetMin: '',
                targetMax: ''
              })}
              style={{
                padding: '10px',
                background: habit.targetType === tt.id ? '#4CAF50' : '#f0f0f0',
                color: habit.targetType === tt.id ? 'white' : '#333',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              {tt.icon} {tt.name}
            </button>
          ))}
        </div>

        {/* Unit Input (if needed) */}
        {selectedType?.needsUnit && (
          <>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Unit:</label>
            <input
              type="text"
              value={habit.targetUnit}
              onChange={(e) => setHabit({...habit, targetUnit: e.target.value})}
              placeholder={selectedType.unitPlaceholder}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '15px',
                borderRadius: '10px',
                border: '1px solid #ddd'
              }}
            />
          </>
        )}

        {/* Target Value (if needed) */}
        {selectedType?.needsValue && (
          <>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Target Goal (optional):</label>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
              <select
                value={habit.targetComparison}
                onChange={(e) => setHabit({...habit, targetComparison: e.target.value})}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #ddd',
                  background: 'white'
                }}
              >
                {comparisons.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>

              {habit.targetComparison === 'between' ? (
                <>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Min"
                    value={habit.targetMin}
                    onChange={(e) => setHabit({...habit, targetMin: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Max"
                    value={habit.targetMax}
                    onChange={(e) => setHabit({...habit, targetMax: e.target.value})}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #ddd'
                    }}
                  />
                </>
              ) : (
                <input
                  type={habit.targetType === 'time' ? 'time' : 'number'}
                  step="0.1"
                  placeholder={`Target ${habit.targetType}`}
                  value={habit.targetValue}
                  onChange={(e) => setHabit({...habit, targetValue: e.target.value})}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #ddd'
                  }}
                />
              )}
            </div>
          </>
        )}

        {/* Description for boolean type */}
        {habit.targetType === 'boolean' && (
          <div style={{
            background: '#e8f5e9',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '15px',
            fontSize: '13px',
            color: '#2e7d32'
          }}>
            ✅ Simple habit: Just mark as Complete or Not Complete each day
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '14px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Create Habit
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f44336',
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

export default HabitAddModal;
