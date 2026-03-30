// Add this import at the top
import HabitCalendar from '../components/HabitCalendar';

// Add this state in the HabitsPage component
const [selectedHabitForCalendar, setSelectedHabitForCalendar] = useState(null);

// Add this function in the HabitsPage component
const updateHabitRecord = (habitId, newRecords) => {
  setHabits(habits.map(habit => 
    habit.id === habitId ? { ...habit, records: newRecords } : habit
  ));
};

// Add this after the Analytics tab, before the closing </div>
// You can add as a third tab or separate section

// Add this inside the tabs section (add a third tab):
<button 
  onClick={() => setActiveTab('calendar')} 
  style={{ padding: '10px 20px', background: 'transparent', color: activeTab === 'calendar' ? 'white' : 'rgba(255,255,255,0.7)', border: 'none', borderBottom: activeTab === 'calendar' ? '2px solid white' : 'none', cursor: 'pointer', fontSize: '16px' }}
>
  📅 Calendar
</button>

// Add this after the Analytics section, before the closing </div>:
{activeTab === 'calendar' && (
  <div>
    <select 
      value={selectedHabitForCalendar || ''} 
      onChange={(e) => setSelectedHabitForCalendar(parseInt(e.target.value))}
      style={{ width: '100%', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #ddd' }}
    >
      <option value="">Select a habit to edit records...</option>
      {habits.map(habit => (
        <option key={habit.id} value={habit.id}>{habit.name}</option>
      ))}
    </select>
    {selectedHabitForCalendar && (
      <HabitCalendar 
        habit={habits.find(h => h.id === selectedHabitForCalendar)} 
        onUpdateRecord={updateHabitRecord}
      />
    )}
  </div>
)}
