import React, { useState } from 'react';
import HabitCard from '../components/HabitCard';
import ProgressChart from '../components/ProgressChart';
import HabitHeatmap from '../components/HabitHeatmap';

function HabitsPage({ habits, setHabits }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('habits');
  const [selectedHabitForHeatmap, setSelectedHabitForHeatmap] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'health',
    type: 'daily',
    targetType: 'boolean',
    color: '#' + Math.floor(Math.random()*16777215).toString(16)
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

  const addHabit = () => {
    if (newHabit.name.trim()) {
      setHabits([...habits, {
        id: Date.now(),
        ...newHabit,
        streak: 0,
        longestStreak: 0,
        lastCompleted: null,
        records: [],
        createdAt: new Date().toISOString()
      }]);
      setNewHabit({ name: '', category: 'health', type: 'daily', targetType: 'boolean', color: '#' + Math.floor(Math.random()*16777215).toString(16) });
      setShowAddModal(false);
    }
  };

  const completeHabit = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id && habit.lastCompleted !== today) {
        const newStreak = (habit.streak || 0) + 1;
        return { 
          ...habit, 
          streak: newStreak, 
          longestStreak: Math.max(newStreak, habit.longestStreak || 0), 
          lastCompleted: today, 
          records: [...(habit.records || []), { date: today, value: true }] 
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
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>📊 Habit Tracker</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Track your daily habits and build better routines</p>
      </div>

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button 
          onClick={() => setShowAddModal(true)} 
          style={{ padding: '12px 24px', background: 'white', color: '#764ba2', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Add New Habit
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid rgba(255,255,255,0.3)' }}>
        <button 
          onClick={() => setActiveTab('habits')} 
          style={{ padding: '10px 20px', background: 'transparent', color: activeTab === 'habits' ? 'white' : 'rgba(255,255,255,0.7)', border: 'none', borderBottom: activeTab === 'habits' ? '2px solid white' : 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          📋 My Habits
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          style={{ padding: '10px 20px', background: 'transparent', color: activeTab === 'analytics' ? 'white' : 'rgba(255,255,255,0.7)', border: 'none', borderBottom: activeTab === 'analytics' ? '2px solid white' : 'none', cursor: 'pointer', fontSize: '16px' }}
        >
          📊 Analytics & Charts
        </button>
      </div>

      {activeTab === 'habits' ? (
        <>
          {/* Filters */}
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: 'white', marginRight: '10px' }}>Category:</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setFilterCategory(cat.id)} 
                    style={{ padding: '8px 16px', background: filterCategory === cat.id ? 'white' : 'rgba(255,255,255,0.2)', color: filterCategory === cat.id ? '#764ba2' : 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
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
                    style={{ padding: '8px 16px', background: filterType === type.id ? 'white' : 'rgba(255,255,255,0.2)', color: filterType === type.id ? '#764ba2' : 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                  >
                    {type.icon} {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Habits Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
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
            <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white' }}>
              <p>No habits found. Click "Add New Habit" to get started!</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <ProgressChart habits={habits} />
          <div style={{ marginTop: '20px' }}>
            <select 
              value={selectedHabitForHeatmap || ''} 
              onChange={(e) => setSelectedHabitForHeatmap(parseInt(e.target.value))} 
              style={{ width: '100%', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #ddd' }}
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '30px', maxWidth: '500px', width: '90%' }}>
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

            <label>Type:</label>
            <select 
              value={newHabit.type} 
              onChange={(e) => setNewHabit({...newHabit, type: e.target.value})} 
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="daily">📅 Daily</option>
              <option value="weekly">📆 Weekly</option>
            </select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={addHabit} 
                style={{ flex: 1, padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Add Habit
              </button>
              <button 
                onClick={() => setShowAddModal(false)} 
                style={{ flex: 1, padding: '12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
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
