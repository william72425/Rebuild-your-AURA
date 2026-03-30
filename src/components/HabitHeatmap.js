import React from 'react';

function HabitHeatmap({ habits, selectedHabitId }) {
  const habit = habits.find(h => h.id === selectedHabitId);
  
  if (!habit) {
    return (
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center', color: '#999' }}>
        📅 Select a habit to view heatmap
      </div>
    );
  }

  // Get last 60 days for better view
  const getLast60Days = () => {
    const days = [];
    for (let i = 59; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      // Check if completed
      const completed = (habit.records || []).some(r => 
        r.value === true && new Date(r.date).toDateString() === date.toDateString()
      );
      
      // Check if not completed (explicitly marked as false)
      const notCompleted = (habit.records || []).some(r => 
        r.value === false && new Date(r.date).toDateString() === date.toDateString()
      );
      
      days.push({ 
        date, 
        completed, 
        notCompleted,
        day: date.getDate(),
        month: date.getMonth()
      });
    }
    return days;
  };

  const days = getLast60Days();
  
  // Group into weeks (8 weeks = 56 days)
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCellColor = (day) => {
    if (day.completed) return '#4CAF50'; // Green - Completed
    if (day.notCompleted) return '#f44336'; // Red - Not Completed
    return '#e0e0e0'; // Gray - No data
  };

  const getCellTitle = (day) => {
    const dateStr = day.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (day.completed) return `${dateStr}: ✅ Completed`;
    if (day.notCompleted) return `${dateStr}: ❌ Not Completed`;
    return `${dateStr}: ⚪ No record`;
  };

  // Calculate statistics
  const totalDays = days.length;
  const completedDays = days.filter(d => d.completed).length;
  const notCompletedDays = days.filter(d => d.notCompleted).length;
  const noDataDays = totalDays - completedDays - notCompletedDays;
  const completionRate = totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(1) : 0;

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', overflowX: 'auto' }}>
      <h3 style={{ marginBottom: '10px' }}>📅 {habit.name} - Last 60 Days</h3>
      
      {/* Statistics Summary */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        flexWrap: 'wrap', 
        marginBottom: '20px',
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>{completedDays}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>✅ Completed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f44336' }}>{notCompletedDays}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>❌ Not Completed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#999' }}>{noDataDays}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>⚪ No Data</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196F3' }}>{completionRate}%</div>
          <div style={{ fontSize: '11px', color: '#666' }}>Completion Rate</div>
        </div>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
        <thead>
          <tr>
            {weekdays.map(day => (
              <th key={day} style={{ padding: '8px', textAlign: 'center', color: '#666', fontSize: '11px' }}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIdx) => (
            <tr key={weekIdx}>
              {week.map((day, dayIdx) => (
                <td key={dayIdx} style={{ padding: '4px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      background: getCellColor(day),
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    title={getCellTitle(day)}
                  >
                    <span style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>
                      {day.day}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
       </table>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', background: '#4CAF50', borderRadius: '4px' }}></div>
          <span style={{ fontSize: '12px' }}>✅ Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', background: '#f44336', borderRadius: '4px' }}></div>
          <span style={{ fontSize: '12px' }}>❌ Not Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '20px', height: '20px', background: '#e0e0e0', borderRadius: '4px' }}></div>
          <span style={{ fontSize: '12px' }}>⚪ No Record</span>
        </div>
      </div>

      <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        🔥 Current Streak: <strong style={{ color: '#ff9800' }}>{habit.streak || 0}</strong> days 
        {habit.longestStreak > 0 && ` | 🏆 Best Streak: ${habit.longestStreak} days`}
      </div>
    </div>
  );
}

export default HabitHeatmap;
