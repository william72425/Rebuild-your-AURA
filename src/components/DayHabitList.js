import React from 'react';

function DayHabitList({ habits, selectedDate, onUpdateHabitStatus, onDeleteHabit }) {
  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);

  const getHabitStatus = (habit) => {
    const record = (habit.records || []).find(r =>
      new Date(r.date).toDateString() === selectedDateObj.toDateString()
    );

    if (!record) {
      return { status: 'no_data', value: null };
    }

    if (record.value === true) {
      return { status: 'completed', value: true };
    }

    if (record.value === false) {
      return { status: 'not_completed', value: false };
    }

    return { status: 'no_data', value: null };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return { bg: '#e8f5e9', border: '#4CAF50', text: '#2e7d32', icon: '✅' };
      case 'not_completed':
        return { bg: '#ffebee', border: '#f44336', text: '#c62828', icon: '❌' };
      default:
        return { bg: '#f5f5f5', border: '#ccc', text: '#999', icon: '⚪' };
    }
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
            const { status } = getHabitStatus(habit);
            const style = getStatusStyle(status);

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
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {habit.type} • 🔥 {habit.streak || 0} day streak
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {status !== 'completed' && (
                    <button
                      onClick={() => onUpdateHabitStatus(habit.id, selectedDateObj, 'completed')}
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
                      ✓ Complete
                    </button>
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
        ✅ Complete = You did it!<br />
        ❌ Not Complete = You didn't do it<br />
        ↺ Clear = Remove record (no data)<br />
        🗑 Delete = Remove habit permanently
      </div>
    </div>
  );
}

export default DayHabitList;
