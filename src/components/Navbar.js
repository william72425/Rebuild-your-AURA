import React from 'react';

function Navbar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'habits', label: '📊 Habits', icon: '📊' },
    { id: 'challenges', label: '🏆 Challenges', icon: '🏆' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      padding: '12px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea, #764ba2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🌟 Aura System
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                padding: '10px 20px',
                background: currentPage === item.id ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
                color: currentPage === item.id ? 'white' : '#333',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
