import React, { useState, useEffect } from 'react';

function App() {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [newHabit, setNewHabit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'health', 'productivity', 'learning', 'mindfulness'];

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabit,
          category: 'productivity',
          streak: 0,
          lastCompleted: null,
          completed: [],
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        }
      ]);
      setNewHabit('');
    }
  };

  const completeHabit = (id) => {
    const today = new Date().toDateString();
    setHabits(habits.map(habit => {
      if (habit.id === id && habit.lastCompleted !== today) {
        return {
          ...habit,
          streak: habit.streak + 1,
          lastCompleted: today,
          completed: [...habit.completed, today]
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

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const filteredHabits = selectedCategory === 'all' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            margin: 0,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            🌟 Aura System
          </h1>
          <p style={{
            fontSize: '1.2rem',
            opacity: 0.9,
            marginTop: '10px'
          }}>
            Track habits. Level up your life.
          </p>
        </div>

        {/* Add Habit Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>
            ✨ Add New Habit
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              placeholder="e.g., Morning Meditation, Read 10 pages..."
              style={{
                flex: 1,
                padding: '12px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#764ba2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <button
              onClick={addHabit}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              + Add Habit
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '25px',
          flexWrap: 'wrap'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 20px',
                background: selectedCategory === cat ? 'white' : 'rgba(255,255,255,0.2)',
                color: selectedCategory === cat ? '#764ba2' : 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Habits List */}
        {filteredHabits.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '60px 20px',
            textAlign: 'center',
            color: 'white'
          }}>
            <p style={{ fontSize: '1.2rem' }}>✨ No habits yet</p>
            <p style={{ opacity: 0.8 }}>Add your first habit above and start your journey!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredHabits.map(habit => (
              <div
                key={habit.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '20px',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: habit.color,
                        boxShadow: `0 0 8px ${habit.color}`
                      }}></div>
                      <h3 style={{ margin: 0, color: '#333' }}>{habit.name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      <span style={{
                        background: '#ff9800',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        🔥 {habit.streak} day streak
                      </span>
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        ✅ {habit.completed.length} total completions
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => completeHabit(habit.id)}
                      style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      ✓ Complete
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      style={{
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      ✗ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Card */}
        {habits.length > 0 && (
          <div style={{
            marginTop: '30px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            color: 'white'
          }}>
            <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>📊 Your Progress</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{habits.length}</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Active Habits</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {habits.reduce((sum, h) => sum + h.streak, 0)}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Streak Days</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {habits.reduce((sum, h) => sum + h.completed.length, 0)}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Total Completions</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animation */}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;
