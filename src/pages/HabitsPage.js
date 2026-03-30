import React, { useState } from 'react';
import HabitCard from '../components/HabitCard';

function HabitsPage({ habits, setHabits }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health',
    type: 'daily',
    targetType: 'boolean',
    targetValue: null,
    unit: '',
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'health', name: 'Health', icon: '💪' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'learning', name: 'Learning', icon: '📚' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'social', name: 'Social', icon: '👥' },
    { id: 'custom', name: 'Custom', icon: '✨' }
  ];

  const habitTypes = [
    { id: 'daily', name: 'Daily', icon: '📅' },
    { id: 'weekly', name: 'Weekly', icon: '📆' },
    { id: 'monthly', name: 'Monthly', icon: '🗓️' }
  ];

  const targetTypes = [
    { id: 'boolean', name: 'Yes/No', icon: '✅' },
    { id: 'numeric', name: 'Numeric', icon: '🔢' },
    { id: 'time', name: 'Time', icon: '⏰' },
    { id: 'duration', name: 'Duration', icon: '⏱️' }
  ];

  const addHabit = () => {
    if (newHabit.name.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          ...newHabit,
          streak: 0,
          longestStreak: 0,
          lastCompleted: null,
          records: [],
          createdAt: new Date().toISOString()
        }
      ]);
      setNewHabit({
        name: '',
        category: 'health',
        type: 'daily',
        targetType: 'boolean',
        targetValue: null,
        unit: '',
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
      });
      setShowAddModal(false);
    }
  };

  const completeHabit = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id && habit.lastCompleted !== today) {
        const newStreak = habit.streak + 1;
        return {
          ...habit,
          streak: newStreak,
          longestStreak: Math.max(newStreak, habit.longestStreak),
          lastCompleted: today,
          records: [...habit.records, { date: today, value: true }]
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    if (window.confirm('Delete this habit?')) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  };

  const filteredHabits = habits.filter(habit => {
    if (filterCategory !== 'all' && habit.category !== filterCategory) return false;
    if (filterType !== 'all' && habit.type !== filterType) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>📊 Habit Tracker</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Track your daily habits and build better routines</p>
      </div>

      {/* Add Habit Button */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#764ba2',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          + Add New Habit
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'white', marginRight: '10px' }}>Category:</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                style={{
                  padding: '8px 16px',
                  background: filterCategory === cat.id ? 'white' : 'rgba(255,255,255,0.2)',
                  color: filterCategory === cat.id ? '#764ba2' : 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ color: 'white', marginRight: '10px' }}>Type:</label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {habitTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                style={{
                  padding: '8px 16px',
                  background: filterType === type.id ? 'white' : 'rgba(255,255,255,0.2)',
                  color: filterType === type.id ? '#764ba2' : 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Habits Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredHabits.map(habit => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onComplete={() => completeHabit(habit.id)}
            onDelete={() => deleteHabit(habit.id)}
          />
        ))}
      </div>

      {filteredHabits.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          color: 'white'
        }}>
          <p>No habits found. Click "Add New Habit" to get started!</p>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2>Add New Habit</h2>
            
            <label>Habit Name:</label>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            />

            <label>Category:</label>
            <select
              value={newHabit.category}
              onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            <label>Habit Type:</label>
            <select
              value={newHabit.type}
              onChange={(e) => setNewHabit({...newHabit, type: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              {habitTypes.map(type => (
                <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
              ))}
            </select>

            <label>Target Type:</label>
            <select
              value={newHabit.targetType}
              onChange={(e) => setNewHabit({...newHabit, targetType: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              {targetTypes.map(tt => (
                <option key={tt.id} value={tt.id}>{tt.icon} {tt.name}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={addHabit}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Add Habit
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitsPage;
