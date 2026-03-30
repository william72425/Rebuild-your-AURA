import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function ProgressChart({ habits }) {
  const getWeeklyData = () => {
    const weeks = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const completions = habits.reduce((sum, habit) => sum + ((habit.records || []).some(r => new Date(r.date).toDateString() === date.toDateString()) ? 1 : 0), 0);
      weeks.push({ day: dayName, completions, total: habits.length, rate: habits.length > 0 ? (completions / habits.length) * 100 : 0 });
    }
    return weeks;
  };

  const getMonthlyData = () => {
    const months = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let totalCompletions = 0;
      habits.forEach(habit => {
        const monthRecords = (habit.records || []).filter(r => { const recordDate = new Date(r.date); return recordDate >= monthStart && recordDate <= monthEnd; });
        totalCompletions += monthRecords.length;
      });
      months.push({ month: monthName, completions: totalCompletions, avgPerDay: Math.round(totalCompletions / 30) });
    }
    return months;
  };

  const getCategoryData = () => {
    const categories = {};
    habits.forEach(habit => { const cat = habit.category || 'other'; categories[cat] = (categories[cat] || 0) + 1; });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4'];
  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();

  return (
    <div>
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>📈 Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend /><Bar dataKey="completions" fill="#4CAF50" name="Completions" /><Bar dataKey="total" fill="#FF9800" name="Total Habits" /></BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '20px' }}>📉 Monthly Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="completions" stroke="#4CAF50" name="Total Completions" /><Line type="monotone" dataKey="avgPerDay" stroke="#2196F3" name="Avg Per Day" /></LineChart>
        </ResponsiveContainer>
      </div>
      {categoryData.length > 0 && (<div style={{ background: 'white', borderRadius: '16px', padding: '20px' }}><h3 style={{ marginBottom: '20px' }}>🥧 Habit Categories</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>)}
    </div>
  );
}

export default ProgressChart;
