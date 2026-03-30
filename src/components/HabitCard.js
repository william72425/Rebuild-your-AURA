import React from 'react';

function HabitCard({ habit, onComplete, onDelete }) {
  const getCategoryIcon = (category) => {
    const icons = { health: '💪', productivity: '⚡', learning: '📚', mindfulness: '🧘', social: '👥', custom: '✨' };
    return icons[category] || '📋';
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      borderLeft: `4px solid ${habit.color || '#764ba2'}`
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '24px' }}>{getCategoryIcon(habit.category)}</span>
            <h3 style={{ margin: 0 }}>{habit.name}</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <span style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>📅 {habit.type || 'daily'}</span>
            <span style={{ background: (habit.color || '#764ba2') + '20', color: habit.color || '#764ba2', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>🎯 {habit.targetType || 'boolean'}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ background: '#ff9800', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
            🔥 {habit.streak || 0} day streak
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>Best: {habit.longestStreak || 0}</div>
        </div>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={(e) => { e.stopPropagation(); onComplete(); }} style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #4CAF50, #45a049)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>✓ Complete</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ padding: '10px 20px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✗</button>
      </div>
    </div>
  );
}

export default HabitCard;
