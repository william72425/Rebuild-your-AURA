const updateHabitStatus = (habitId, date, newStatus) => {
  const dateStr = date.toDateString();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  setHabits(habits.map(habit => {
    if (habit.id !== habitId) return habit;

    let newRecords = [...(habit.records || [])];
    const existingIndex = newRecords.findIndex(r => new Date(r.date).toDateString() === dateStr);

    // Remove existing record if any
    if (existingIndex !== -1) {
      newRecords.splice(existingIndex, 1);
    }

    // Add new record based on status
    if (newStatus === 'completed') {
      newRecords.push({ date: date.toISOString(), value: true });
    } else if (newStatus === 'not_completed') {
      newRecords.push({ date: date.toISOString(), value: false });
    }
    // if newStatus === 'no_data', just remove record (already done above)

    // Calculate streak based on consecutive completed days from today backwards
    let streak = 0;
    let checkDate = new Date(today);
    while (true) {
      const hasCompleted = newRecords.some(r => 
        r.value === true && new Date(r.date).toDateString() === checkDate.toDateString()
      );
      if (!hasCompleted) break;
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak from all records
    let longestStreak = habit.longestStreak || 0;
    let currentStreak = 0;
    let tempDate = new Date(today);
    const maxDate = new Date(Math.min(...newRecords.map(r => new Date(r.date).getTime()), today.getTime()));
    
    // Simple longest streak calculation
    for (let i = 0; i < 365; i++) {
      const checkDate2 = new Date(today);
      checkDate2.setDate(today.getDate() - i);
      const hasCompleted = newRecords.some(r => 
        r.value === true && new Date(r.date).toDateString() === checkDate2.toDateString()
      );
      if (hasCompleted) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return {
      ...habit,
      records: newRecords,
      streak: streak,
      longestStreak: longestStreak,
      lastCompleted: streak > 0 ? today.toDateString() : null
    };
  }));
};
