import React from 'react';

const Calendar = ({ dateString, themeAccent, themeText, groomName, brideName }) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date)) return null;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentWeek = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    currentWeek.push(i);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Calculate D-Day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(year, month, day);
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let dDayText = "";
  if (diffDays > 0) dDayText = `D-${diffDays}`;
  else if (diffDays === 0) dDayText = `D-DAY`;
  else dDayText = `D+${Math.abs(diffDays)}`;

  return (
    <div style={{ width: '100%', maxWidth: '280px', margin: '30px auto 40px auto', fontFamily: 'var(--font-kr-sans)' }}>
      <div style={{ textAlign: 'center', fontSize: 'calc(1.2rem * var(--font-ratio))', marginBottom: '20px', letterSpacing: 'calc(0.1rem * var(--font-ratio))' }}>
        {year}. {String(month + 1).padStart(2, '0')}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '10px' }}>
        {daysOfWeek.map((d, i) => (
          <div key={i} style={{ fontSize: 'calc(0.8rem * var(--font-ratio))', color: i === 0 ? '#ff4d4f' : '#888' }}>{d}</div>
        ))}
        
        {weeks.map((week, wi) => (
          week.map((d, di) => {
            const isToday = d === day;
            return (
              <div key={`${wi}-${di}`} style={{ 
                height: '30px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 'calc(0.9rem * var(--font-ratio))',
                backgroundColor: isToday ? themeAccent : 'transparent',
                borderRadius: '50%',
                color: isToday ? '#fff' : (d ? (di === 0 ? '#ff4d4f' : themeText) : 'transparent')
              }}>
                {d}
              </div>
            )
          })
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 'calc(0.85rem * var(--font-ratio))', color: themeText, opacity: 0.8, paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
        {groomName} <span>&hearts;</span> {brideName} 결혼식이 
        <span style={{ color: themeAccent, fontWeight: 'bold' }}> {dDayText}</span>
      </div>
    </div>
  );
};

export default Calendar;
