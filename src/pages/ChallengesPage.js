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
    const videoId = url.split('v=')[1]?.split('&')[0];
    window.open(videoId ? `https://www.youtube.com/embed/${videoId}` : url, '_blank');
  };

  const filteredChallenges = challenges.filter(c => { if (filter === 'active') return c.status === 'active'; if (filter === 'completed') return c.status === 'completed'; return true; });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}><h1 style={{ color: 'white' }}>🏆 Advanced Challenges</h1><p style={{ color: 'rgba(255,255,255,0.9)' }}>Push your limits with structured challenges</p></div>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}><button onClick={() => setShowModal(true)} style={{ padding: '12px 24px', background: 'white', color: '#764ba2', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>+ Create Advanced Challenge</button></div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>{['all', 'active', 'completed'].map(f => (<button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 20px', background: filter === f ? 'white' : 'rgba(255,255,255,0.2)', color: filter === f ? '#764ba2' : 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>))}</div>
      {filteredChallenges.length === 0 ? (<div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', color: 'white' }}><p>No challenges yet. Create your first advanced challenge!</p></div>) : (filteredChallenges.map(challenge => (<div key={challenge.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px', borderLeft: `4px solid ${challenge.status === 'completed' ? '#4CAF50' : '#FF9800'}` }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}><div><h3 style={{ margin: '0 0 8px 0' }}>{challenge.title}</h3><p style={{ color: '#666' }}>{challenge.description}</p><div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}><span style={{ background: '#e0e0e0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>📅 {challenge.duration} days</span><span style={{ background: challenge.status === 'completed' ? '#e8f5e9' : '#fff3e0', color: challenge.status === 'completed' ? '#4CAF50' : '#FF9800', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{challenge.status.toUpperCase()}</span></div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: '24px', fontWeight: 'bold', color: challenge.status === 'completed' ? '#4CAF50' : '#FF9800' }}>{Math.round(challenge.progress || 0)}%</div></div></div><div style={{ background: '#e0e0e0', borderRadius: '10px', height: '8px', marginTop: '15px' }}><div style={{ width: `${challenge.progress || 0}%`, background: challenge.status === 'completed' ? '#4CAF50' : '#FF9800', borderRadius: '10px', height: '100%' }}></div></div>{challenge.tasks && challenge.tasks.length > 0 && (<div style={{ marginTop: '20px' }}><h4>📋 Tasks</h4>{challenge.tasks.map(task => (<div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: task.isCompleted ? '#e8f5e9' : '#f5f5f5', borderRadius: '10px', marginBottom: '8px' }}><input type="checkbox" checked={task.isCompleted} onChange={() => completeTask(challenge.id, task.id)} style={{ width: '20px', height: '20px' }} /><div style={{ flex: 1 }}><div style={{ fontWeight: 'bold' }}>Day {task.day}: {task.title}</div><div style={{ fontSize: '12px', color: '#666' }}>{task.description}</div></div>{task.links && task.links.map((link, idx) => (<button key={idx} onClick={() => openYouTubeLink(link.url)} style={{ padding: '6px 12px', background: '#ff0000', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>▶ Watch</button>))}</div>))}</div>)}</div>)))}

      {/* Modal */}
      {showModal && (<div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, overflow: 'auto' }}><div style={{ background: 'white', borderRadius: '20px', padding: '30px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}><h2>Create Advanced Challenge</h2><div style={{ marginBottom: '20px' }}><label>Challenge Type:</label><div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}><button onClick={() => setChallengeType('task-based')} style={{ flex: 1, padding: '10px', background: challengeType === 'task-based' ? '#4CAF50' : '#e0e0e0', color: challengeType === 'task-based' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>📋 Task-Based</button><button onClick={() => setChallengeType('habit-linked')} style={{ flex: 1, padding: '10px', background: challengeType === 'habit-linked' ? '#4CAF50' : '#e0e0e0', color: challengeType === 'habit-linked' ? 'white' : '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔗 Habit-Linked</button></div></div><label>Challenge Title:</label><input type="text" value={challenge.title} onChange={(e) => setChallenge({...challenge, title: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} /><label>Description:</label><textarea value={challenge.description} onChange={(e) => setChallenge({...challenge, description: e.target.value})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} rows="3" /><label>Duration (days):</label><input type="number" value={challenge.duration} onChange={(e) => setChallenge({...challenge, duration: parseInt(e.target.value)})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} />
      {challengeType === 'habit-linked' && (<div><label>Link to Habit:</label><select value={challenge.linkedHabit || ''} onChange={(e) => setChallenge({...challenge, linkedHabit: e.target.value || null})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}><option value="">Select a habit...</option>{habits.map(habit => (<option key={habit.id} value={habit.id}>{habit.name}</option>))}</select><label>Target Rule:</label><select value={challenge.rules.comparison} onChange={(e) => setChallenge({...challenge, rules: {...challenge.rules, comparison: e.target.value}})} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }}><option value="equals">Equals</option><option value="greater">Greater than</option><option value="less">Less than</option><option value="between">Between</option></select>{challenge.rules.comparison === 'between' ? (<div style={{ display: 'flex', gap: '10px' }}><input type="text" placeholder="Min (e.g., 22:00)" onChange={(e) => setChallenge({...challenge, rules: {...challenge.rules, minValue: e.target.value}})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} /><input type="text" placeholder="Max (e.g., 23:00)" onChange={(e) => setChallenge({...challenge, rules: {...challenge.rules, maxValue: e.target.value}})} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} /></div>) : (<input type="text" placeholder="Target value" onChange={(e) => setChallenge({...challenge, rules: {...challenge.rules, targetValue: e.target.value}})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />)}</div>)}
      {challengeType === 'task-based' && (<div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' }}><h4>Add Daily Tasks</h4><input type="text" placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} /><textarea placeholder="Task description" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} rows="2" /><input type="text" placeholder="YouTube or article link" value={taskLink} onChange={(e) => setTaskLink(e.target.value)} style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' }} /><button onClick={addTask} style={{ padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ Add Task</button>{challenge.tasks.length > 0 && (<div style={{ marginTop: '15px' }}><h5>Tasks ({challenge.tasks.length}/{challenge.duration})</h5>{challenge.tasks.map((t, idx) => (<div key={idx} style={{ padding: '8px', background: '#f5f5f5', marginBottom: '5px', borderRadius: '8px' }}>Day {t.day}: {t.title}</div>))}</div>)}</div>)}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}><button onClick={createChallenge} style={{ flex: 1, padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Create Challenge</button><button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button></div></div></div>)}
    </div>
  );
}

export default ChallengesPage;
