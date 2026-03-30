import React, { useState } from 'react';
import HabitDisplayCard from '../components/HabitDisplayCard';
import HabitAddModal from '../components/HabitAddModal';
import HabitEntryModal from '../components/HabitEntryModal';
import ProgressChart from '../components/ProgressChart';
import DateNavigator from '../components/DateNavigator';

function HabitsPage({ habits, setHabits }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };

  const updateHabitEntry = (habitId, date, value, notes) => {
    const dateStr = date.toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
      let newRecords = [...(habit.records || [])];
      const existingIndex = newRecords.findIndex(r => new Date(r.date).toDateString() === dateStr);
      
      if (existingIndex !== -1) {
        newRecords.splice(existingIndex, 1);
      }
      
      newRecords.push({ date: date.toISOString(), value, notes });
      
      // Recalculate streak (consecutive days with truthy values)
      let streak = 0;
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      while (true) {
        const record = newRecords.find(r => new Date(r.date).toDateString() === checkDate.toDateString());
        const isValid = record && (record.value === true || (typeof record.value === 'number' && record.value > 0) || (typeof record.value === 'string' && record.value));
        if (!isValid) break;
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      return {
        ...habit,
        records: newRecords,
        streak,
        longestStreak: Math.max(streak, habit.longestStreak || 0)
      };
    }));
  };

  const markNotCompleted = (habitId, date) => {
    const dateStr = date.toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id !== habitId) return habit;
      
      let newRecords = [...(habit.records || [])];
      const existingIndex = newRecords.findIndex(r => new Date(r.date).toDateString() === dateStr);
      
      if (existingIndex !== -1) {
        newRecords.splice(existingIndex, 1);
      }
      
      newRecords.push({ date: date.toISOString(), value: false });
      
      // Recalculate streak
      let streak = 0;
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      while (true) {
        const record = newRecords.find(r => new Date(r.date).toDateString() === checkDate.toDateString());
        const isValid = record && record.value === true;
        if (!isValid) break;
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      return {
        ...habit,
        records: newRecords,
        streak,
        longestStreak: Math.max(streak, habit.longestStreak || 0)
      };
    }));
  };

  const deleteHabit = (id) => {
    if (window.confirm('Delete this habit? This will remove all its history.')) {
      setHabits(habits.filter(habit => habit.id !== id));
    }
  };

  const filteredHabits = habits.filter(habit => {
    if (filterCategory !== 'all' && habit.category !== filterCategory) return false;
    if (filterType !== 'all' && habit.type !== filterType) return false;
    return true;
  });

  const handleHabitClick = (habit) => {
    setShowEntryModal({ habit, date: selectedDate });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>📊 Habit Tracker</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Track any habit, any way you want</p>
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
                <button
                  onClick={() => setFilterType('all')}
                  style={{
                    padding: '8px 16px',
                    background: filterType === 'all' ? 'white' : 'rgba(255,255,255,0.2)',
                    color: filterType === 'all' ? '#764ba2' : 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  📋 All
                </button>
                <button
                  onClick={() => setFilterType('daily')}
                  style={{
                    padding: '8px 16px',
                    background: filterType === 'daily' ? 'white' : 'rgba(255,255,255,0.2)',
                    color: filterType === 'daily' ? '#764ba2' : 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  📅 Daily
                </button>
                <button
                  onClick={() => setFilterType('weekly')}
                  style={{
                    padding: '8px 16px',
                    background: filterType === 'weekly' ? 'white' : 'rgba(255,255,255,0.2)',
                    color: filterType === 'weekly' ? '#764ba2' : 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer'
                  }}
                >
                  📆 Weekly
                </button>
              </div>
            </div>
          </div>

          {/* Date Navigator */}
          <DateNavigator
            currentDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Habits List */}
          {filteredHabits.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white' }}>
              <p>No habits yet. Click "Add New Habit" to get started!</p>
            </div>
          ) : (
            filteredHabits.map(habit => (
              <HabitDisplayCard
                key={habit.id}
                habit={habit}
                onPress={() => handleHabitClick(habit)}
              />
            ))
          )}
        </>
      )}

      {activeTab === 'analytics' && (
        <ProgressChart habits={habits} />
      )}

      {/* Modals */}
      {showAddModal && (
        <HabitAddModal
          onSave={addHabit}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showEntryModal && (
        <HabitEntryModal
          habit={showEntryModal.habit}
          date={showEntryModal.date}
          onSave={updateHabitEntry}
          onUpdateHabitStatus={markNotCompleted}
          onClose={() => setShowEntryModal(null)}
        />
      )}
    </div>
  );
}

export default HabitsPage;
