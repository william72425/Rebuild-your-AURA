import React, { useState } from 'react';

function ChallengesPage({ challenges, setChallenges, habits }) {
  const [showModal, setShowModal] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    duration: 7,
    linkedHabit: null,
    targetValue: null
  });

  const createChallenge = () => {
    if (newChallenge.title.trim()) {
      setChallenges([
        ...challenges,
        {
          id: Date.now(),
          ...newChallenge,
          status: 'active',
          progress: 0,
          tasks: [],
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      ]);
      setShowModal(false);
      setNewChallenge({ title: '', description: '', duration: 7, linkedHabit: null, targetValue: null });
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: 'white' }}>🏆 Challenges</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)' }}>Push your limits and earn rewards</p>
      </div>

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#764ba2',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          + Start New Challenge
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {challenges.map(challenge => (
          <div key={challenge.id} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <div style={{
              background: '#e0e0e0',
              borderRadius: '10px',
              height: '8px',
              marginTop: '10px'
            }}>
              <div style={{
                width: `${challenge.progress}%`,
                background: '#4CAF50',
                borderRadius: '10px',
                height: '100%'
              }}></div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              Progress: {challenge.progress}%
            </div>
          </div>
        ))}
      </div>

      {challenges.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '20px',
          color: 'white'
        }}>
          <p>No challenges yet. Start your first challenge!</p>
        </div>
      )}

      {/* Create Challenge Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2>Create New Challenge</h2>
            
            <label>Challenge Title:</label>
            <input
              type="text"
              value={newChallenge.title}
              onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            />

            <label>Description:</label>
            <textarea
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
              rows="3"
            />

            <label>Duration (days):</label>
            <input
              type="number"
              value={newChallenge.duration}
              onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            />

            <label>Link to Habit (Optional):</label>
            <select
              value={newChallenge.linkedHabit || ''}
              onChange={(e) => setNewChallenge({...newChallenge, linkedHabit: e.target.value || null})}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="">None</option>
              {habits.map(habit => (
                <option key={habit.id} value={habit.id}>{habit.name}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={createChallenge}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Create Challenge
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
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

export default ChallengesPage;
