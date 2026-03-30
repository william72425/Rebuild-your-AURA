import React, { useState } from 'react';
import ProgressChart from '../components/ProgressChart';
import HabitHeatmap from '../components/HabitHeatmap';
import DateNavigator from '../components/DateNavigator';
import DayHabitList from '../components/DayHabitList';

function HabitsPage({ habits, setHabits }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');
  const [selectedHabitForHeatmap, setSelectedHabitForHeatmap] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health',
    type: 'daily',
    targetType: 'boolean',
    targetUnit: '',
    targetValue: '',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16)
  });

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
    { id: 'all', name: 'All', icon: '📋' },
    { id: 'daily', name: 'Daily', icon: '📅' },
    { id: 'weekly', name: 'Weekly', icon: '📆' }
  ];

  // Target Types with their units and input types
  const targetTypes = [
    { id: 'boolean', name: 'Yes/No', icon: '✅❌', placeholder: '', unit: '' },
    { id: 'count', name: 'Count', icon: '🔢', placeholder: 'e.g., 10 pushups', unit: 'times' },
    { id: 'duration', name: 'Duration', icon: '⏱️', placeholder: 'e.g., 30', unit: 'minutes' },
    { id: 'time', name: 'Time', icon: '⏰', placeholder: 'e.g., 22:00', unit: 'PM' },
    { id: 'volume', name: 'Volume', icon: '💧', placeholder: 'e.g., 2', unit: 'litres' },
    { id: 'pages', name: 'Pages', icon: '📖', placeholder: 'e.g., 20', unit: 'pages' },
    { id: 'distance', name: 'Distance', icon: '🏃', placeholder: 'e.g., 5', unit: 'km' }
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
        targetUnit: '',
        targetValue: '',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      });
      setShowAddModal(false);
    }
  };

  const updateHabitStatus = (habitId, date, newStatus, customValue = null) => {
    const dateStr = date.toDateString();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;

      let newRecords = [...(habit.records || [])];
      const existingIndex = newRecords.findIndex(r => new Date(r.date).toDateString() === dateStr);

      if (existingIndex !== -1) {
        newRecords.splice(existingIndex, 1);
      }

      // Add record based on habit type
      let recordValue = true;
      if (habit.targetType === 'boolean') {
        recordValue = newStatus === 'completed';
      } else if (habit.targetType !== 'boolean') {
        recordValue = customValue !== null ? customValue : (newStatus === 'completed' ? habit.targetValue : 0);
      }

      if (newStatus === 'completed') {
        newRecords.push({ date: date.toISOString(), value: recordValue });
      } else if (newStatus === 'not_completed') {
        newRecords.push({ date: date.toISOString(), value: false });
      }

      // Calculate streak based on consecutive completed days
      let streak = 0;
      let checkDate = new Date(today);
      while (true) {
        const hasCompleted = newRecords.some(r => 
          r.value === true && new Date(r.date).toDateString() === checkDate.toDateString()
        );
        if (!hasCompleted) break;
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Calculate longest streak
      let longestStreak = habit.longestStreak || 0;
      let currentStreak = 0;
      for (let i = 0; i < 365; i++) {
        const checkDate2 = new Date(today);
        checkDate2.setDate(today.getDate() - i);
        const hasCompleted = newRecords.some(r => 
          r.value === true && new Date(r.date).toDateString() === checkDate2.toDateString()
        );
        if (hasCompleted) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      return {
        ...habit,
        records: newRecords,
        streak: streak,
        longestStreak: longestStreak,
        lastCompleted: streak > 0 ? today.toDateString() : null
      };
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

  // Get target type display info
  const getTargetTypeInfo = (targetType) => {
    const found = targetTypes.find(t => t.id === targetType);
    return found || targetTypes[0];
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>📊 Habit Tracker</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Track your daily habits and build better routines</p>
      </div>

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
            fontWeight: 'bold'
          }}
        >
          + Add New Habit
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        borderBottom: '2px solid rgba(255,255,255,0.3)',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('habits')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: activeTab === 'habits' ? 'white' : 'rgba(255,255,255,0.7)',
            border: 'none',
            borderBottom: activeTab === 'habits' ? '2px solid white' : 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📋 Daily Tracker
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            color: activeTab === 'analytics' ? 'white' : 'rgba(255,255,255,0.7)',
            border: 'none',
            borderBottom: activeTab === 'analytics' ? '2px solid white' : 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          📊 Analytics
        </button>
      </div>

      {/* Daily Tracker Tab */}
      {activeTab === 'habits' && (
        <>
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

          {/* Date Navigator */}
          <DateNavigator
            currentDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Day Habit List */}
          <DayHabitList
            habits={filteredHabits}
            selectedDate={selectedDate}
            onUpdateHabitStatus={updateHabitStatus}
            onDeleteHabit={deleteHabit}
            targetTypes={targetTypes}
          />
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <ProgressChart habits={habits} />
          <div style={{ marginTop: '20px' }}>
            <select
              value={selectedHabitForHeatmap || ''}
              onChange={(e) => setSelectedHabitForHeatmap(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '1px solid #ddd'
              }}
            >
              <option value="">Select a habit to view heatmap...</option>
              {habits.map(habit => (
                <option key={habit.id} value={habit.id}>{habit.name}</option>
              ))}
            </select>
            <HabitHeatmap habits={habits} selectedHabitId={selectedHabitForHeatmap} />
          </div>
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
            <h2 style={{ marginBottom: '20px' }}>✨ Add New Habit</h2>

            <label style={{ fontWeight: 'bold' }}>Habit Name:</label>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              placeholder="e.g., Morning Meditation, Read Books, Drink Water"
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            />

            <label style={{ fontWeight: 'bold' }}>Category:</label>
            <select
              value={newHabit.category}
              onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              {categories.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>

            <label style={{ fontWeight: 'bold' }}>Habit Type:</label>
            <select
              value={newHabit.type}
              onChange={(e) => setNewHabit({ ...newHabit, type: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              <option value="daily">📅 Daily</option>
              <option value="weekly">📆 Weekly</option>
            </select>

            <label style={{ fontWeight: 'bold' }}>Target Type:</label>
            <select
              value={newHabit.targetType}
              onChange={(e) => {
                const selected = targetTypes.find(t => t.id === e.target.value);
                setNewHabit({ 
                  ...newHabit, 
                  targetType: e.target.value,
                  targetUnit: selected?.unit || '',
                  targetValue: ''
                });
              }}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
            >
              {targetTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.name} {type.unit ? `(${type.unit})` : ''}
                </option>
              ))}
            </select>

            {newHabit.targetType !== 'boolean' && (
              <>
                <label style={{ fontWeight: 'bold' }}>
                  Target {getTargetTypeInfo(newHabit.targetType).name}:
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type={newHabit.targetType === 'time' ? 'time' : 'number'}
                    step={newHabit.targetType === 'duration' ? '1' : '0.1'}
                    value={newHabit.targetValue}
                    onChange={(e) => setNewHabit({ ...newHabit, targetValue: e.target.value })}
                    placeholder={getTargetTypeInfo(newHabit.targetType).placeholder}
                    style={{
                      flex: 2,
                      padding: '10px',
                      margin: '10px 0',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                  <span style={{ flex: 1, color: '#666' }}>
                    {getTargetTypeInfo(newHabit.targetType).unit}
                  </span>
                </div>
              </>
            )}

            {newHabit.targetType === 'boolean' && (
              <div style={{
                background: '#e8f5e9',
                padding: '10px',
                borderRadius: '8px',
                margin: '10px 0',
                fontSize: '12px',
                color: '#2e7d32'
              }}>
                ✅ Simple Yes/No habit - just mark complete or not complete
              </div>
            )}

            {newHabit.targetType === 'volume' && (
              <div style={{
                background: '#e3f2fd',
                padding: '10px',
                borderRadius: '8px',
                margin: '10px 0',
                fontSize: '12px',
                color: '#1565c0'
              }}>
                💧 Example: Drink 2 litres of water daily
              </div>
            )}

            {newHabit.targetType === 'time' && (
              <div style={{
                background: '#fff3e0',
                padding: '10px',
                borderRadius: '8px',
                margin: '10px 0',
                fontSize: '12px',
                color: '#e65100'
              }}>
                ⏰ Example: Sleep before 11:00 PM
              </div>
            )}

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
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ➕ Add Habit
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
