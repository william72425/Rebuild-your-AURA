import React from 'react';

function HabitHeatmap({ habits, selectedHabitId }) {
  const habit = habits.find(h => h.id === selectedHabitId);
  if (!habit) return (<div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', color: '#999' }}>Select a habit to view heatmap</div>);

  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const completed = (habit.records || []).some(r => new Date(r.date).toDateString() === date.toDateString());
      days.push({ date, completed, day: date.getDate() });
    }
    return days;
  };

  const days = getLast30Days();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '20px' }}>📅 {habit.name} - Last 30 Days</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (<th key={day} style={{ padding: '8px', color: '#666' }}>{day}</th>))}</tr></thead>
        <tbody>{weeks.map((week, idx) => (<tr key={idx}>{week.map((day, didx) => (<td key={didx} style={{ padding: '8px' }}><div style={{ width: '40px', height: '40px', background: day.completed ? '#4CAF50' : '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}><span style={{ fontSize: '12px', color: day.completed ? 'white' : '#666' }}>{day.day}</span></div></td>))}</tr>))}</tbody>
       </table>
      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', background: '#4CAF50', borderRadius: '4px' }}></div><span>Completed</span></div><div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '20px', height: '20px', background: '#e0e0e0', borderRadius: '4px' }}></div><span>Missed</span></div></div>
    </div>
  );
}

export default HabitHeatmap;
