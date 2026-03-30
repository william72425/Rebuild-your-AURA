import React from 'react';

function ProgressChart({ habits }) {
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return days.map((day, index) => {
      const date = new Date();
      date.setDate(today.getDate() - (6 - index));
      const completions = habits.filter(habit => 
        (habit.records || []).some(r => new Date(r.date).toDateString() === date.toDateString())
      ).length;
      return { day, completions, total: habits.length };
    });
  };

  const weeklyData = getWeeklyData();
  const maxCompletions = Math.max(...weeklyData.map(d => d.completions), habits.length);

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + (h.records || []).length, 0);

  return (
    <div>
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>📈 Weekly Progress</h3>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {weeklyData.map((day, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: 1, minWidth: '40px' }}>
              <div style={{ 
                height: `${(day.completions / (maxCompletions || 1)) * 150}px`, 
                width: '40px', 
                background: '#4CAF50', 
                borderRadius: '8px 8px 0 0',
                marginBottom: '8px'
              }}></div>
              <div style={{ fontWeight: 'bold' }}>{day.day}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{day.completions}/{day.total}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>📊 Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>{habits.length}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Habits</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9800' }}>{totalStreak}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Streak</div>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', background: '#f5f5f5', borderRadius: '12px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196F3' }}>{totalCompletions}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Completions</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressChart;
