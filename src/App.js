import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import ChallengesPage from './pages/ChallengesPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [challenges, setChallenges] = useState(() => {
    const saved = localStorage.getItem('challenges');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('challenges', JSON.stringify(challenges));
  }, [challenges]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div style={{ padding: '80px 20px 20px 20px' }}>
        {currentPage === 'home' && <HomePage habits={habits} challenges={challenges} />}
        {currentPage === 'habits' && <HabitsPage habits={habits} setHabits={setHabits} />}
        {currentPage === 'challenges' && <ChallengesPage challenges={challenges} setChallenges={setChallenges} habits={habits} />}
      </div>
    </div>
  );
}

export default App;
