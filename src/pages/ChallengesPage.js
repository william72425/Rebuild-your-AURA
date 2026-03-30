import React, { useState } from 'react';

function ChallengesPage({ challenges, setChallenges, habits }) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [challengeType, setChallengeType] = useState('task-based');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskLink, setTaskLink] = useState('');
  const [challenge, setChallenge] = useState({ title: '', description: '', duration: 30, linkedHabit: null, tasks: [], rules: { comparison: 'equals', targetValue: null, minValue: null, maxValue: null } });

  const addTask = () => {
    if (taskTitle.trim()) {
      setChallenge({ ...challenge, tasks: [...challenge.tasks, { id: Date.now(), day: challenge.tasks.length + 1, title: taskTitle, description: taskDesc, links: taskLink ? [{ url: taskLink, type: taskLink.includes('youtube') ? 'youtube' : 'external' }] : [], isCompleted: false }] });
      setTaskTitle(''); setTaskDesc(''); setTaskLink('');
    }
  };

  const createChallenge = () => {
    if (challenge.title.trim()) {
      setChallenges([...challenges, { ...challenge, id: Date.now(), status: 'active', progress: 0, startDate: new Date().toISOString() }]);
      setShowModal(false);
      setChallenge({ title: '', description: '', duration: 30, linkedHabit: null, tasks: [], rules: { comparison: 'equals', targetValue: null, minValue: null, maxValue: null } });
    }
  };

  const completeTask = (challengeId, taskId) => {
    setChallenges(challenges.map(c => {
      if (c.id === challengeId) {
        const updatedTasks = c.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
        const completedCount = updatedTasks.filter(t => t.isCompleted).length;
        const progress = (completedCount / updatedTasks.length) * 100;
        return { ...c, tasks: updatedTasks, progress, status: progress === 100 ? 'completed' : 'active' };
      }
      return c;
    }));
  };

  const openYouTubeLink = (url) => {
    const videoId = url.split('v=')[1
