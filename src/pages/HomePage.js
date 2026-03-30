import React from 'react';

function HomePage({ habits, challenges }) {
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.records.length, 0);
  const activeChallenges = challenges.filter(c => c.status === 'active').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '48px', marginBottom: '10px' }}>
          Welcome to Aura System ✨
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
          Your personal growth companion
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '48px' }}>📊</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{habits.length}</div>
          <div>Active Habits</div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '48px' }}>🔥</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalStreak}</div>
          <div>Total Streak Days</div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '48px' }}>✅</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalCompletions}</div>
          <div>Total Completions</div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '25px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '48px' }}>🏆</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{activeChallenges}</div>
          <div>Active Challenges</div>
        </div>
      </div>

      {/* Quick Tips */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h3>💡 Quick Tips</h3>
        <p>• Start with 2-3 habits to build momentum</p>
        <p>• Complete habits daily to maintain streaks</p>
        <p>• Join challenges to level up faster</p>
      </div>
    </div>
  );
}

export default HomePage;
