import React from 'react';

function HabitDisplayCard({ habit, onPress, onDelete }) {
  const getTargetTypeInfo = () => {
    const types = {
      boolean: { icon: '✅❌', label: 'Yes/No' },
      count: { icon: '🔢', label: 'Count' },
      duration: { icon: '⏱️', label: 'Duration' },
      volume: { icon: '💧', label: 'Volume' },
      distance: { icon: '🏃', label: 'Distance' },
      pages: { icon: '📖', label: 'Pages' },
      time: { icon: '⏰', label: 'Time' },
      custom: { icon: '✨', label: 'Custom' }
    };
    return types[habit.targetType] || types.boolean;
  };

  const getCategoryIcon = () => {
    const icons = {
      health: '💪', productivity: '⚡', learning: '📚',
      mindfulness: '🧘', social: '👥', custom: '✨'
    };
    return icons[habit.category] || '📋';
  };

  const getTargetDisplay = () => {
    if (habit.targetType === 'boolean') return null;
    
    const unit = habit.targetUnit ? ` ${habit.targetUnit}` : '';
    
    if (habit.targetComparison === 'between') {
      return `${habit.targetMin} - ${habit.targetMax}${unit}`;
    }
    if (habit.targetValue) {
      const comparisonSymbol = { '>=': '≥', '<=': '≤', '=': '=' }[habit.targetComparison] || habit.targetComparison;
      return `${comparisonSymbol} ${habit.targetValue}${unit}`;
    }
    return `Track ${habit.targetType}${unit}`;
  };

  const targetInfo = getTargetTypeInfo();
  const targetDisplay = getTargetDisplay();

  return (
    <div
      onClick={onPress}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '18px',
        marginBottom: '12px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: `4px solid ${habit.color || '#764ba2'}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '22px' }}>{getCategoryIcon()}</span>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{habit.name}</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{
              background: '#f0f0f0',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px'
            }}>
              {targetInfo.icon} {targetInfo.label}
            </span>
            <span style={{
              background: '#e3f2fd',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              color: '#1565c0'
            }}>
              {habit.type === 'daily' ? '📅 Daily' : '📆 Weekly'}
            </span>
          </div>
          {targetDisplay && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              🎯 Target: {targetDisplay}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: '#ff9800',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            🔥 {habit.streak || 0} day streak
          </div>
          {habit.longestStreak > 0 && (
            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
              Best: {habit.longestStreak}
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitDisplayCard;
