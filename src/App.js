import React, { useState, useEffect } from 'react';

function App() {
  // Habit များ သိမ်းမယ်
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  // Habit အသစ်ထည့်မယ်
  const [newHabit, setNewHabit] = useState('');

  // Habit add လုပ်တဲ့ function
  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabit,
          streak: 0,
          lastCompleted: null,
          completed: []
        }
      ]);
      setNewHabit('');
    }
  };

  // Habit complete လုပ်တဲ့ function
  const completeHabit = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // ဒီနေ့ ပြီးပြီလား စစ်မယ်
        if (habit.lastCompleted !== today) {
          return {
            ...habit,
            streak: habit.streak + 1,
            lastCompleted: today,
            completed: [...habit.completed, today]
          };
        }
      }
      return habit;
    }));
  };

  // Habit delete လုပ်မယ်
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  // Local storage မှာ သိမ်းမယ်
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', color: '#4CAF50' }}>
        🌟 Aura System - Habit Tracker
      </h1>

      {/* Habit အသစ်ထည့်တဲ့ပုံစံ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          placeholder="Add new habit..."
          style={{
            flex: 1,
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={addHabit}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      {/* Habit စာရင်း */}
      {habits.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>
          No habits yet. Add your first habit above!
        </p>
      ) : (
        habits.map(habit => (
          <div
            key={habit.id}
            style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 5px 0' }}>{habit.name}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                🔥 {habit.streak} day streak
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => completeHabit(habit.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✓ Complete
              </button>
              <button
                onClick={() => deleteHabit(habit.id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✗ Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* Motivation အကြံပေးချက် */}
      {habits.length > 0 && (
        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#2e7d32' }}>
            💪 Keep going! Total habits: {habits.length} | 
            Total completions: {habits.reduce((sum, h) => sum + h.completed.length, 0)}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
