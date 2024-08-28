// src/App.js
import React, { useState } from 'react';
import './index.css';

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventText, setEventText] = useState('');
  const [eventType, setEventType] = useState('Personal');
  const [filter, setFilter] = useState('All');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const generateCalendar = () => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const days = [];

    for (let i = 0; i < start.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= end.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    if (day) {
      const dateKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;
      setSelectedDate(dateKey);
      const event = events[dateKey] || { text: '', type: 'Personal' };
      setEventText(event.text);
      setEventType(event.type);
    }
  };

  const handleEventSave = () => {
    if (selectedDate) {
      setEvents({
        ...events,
        [selectedDate]: {
          text: eventText,
          type: eventType
        }
      });
      setSelectedDate(null);
      setEventText('');
      setEventType('Personal');
    }
  };

  const handleEventDelete = () => {
    if (selectedDate) {
      const updatedEvents = { ...events };
      delete updatedEvents[selectedDate];
      setEvents(updatedEvents);
      setSelectedDate(null);
      setEventText('');
      setEventType('Personal');
    }
  };

  const handleEventTextChange = (e) => {
    setEventText(e.target.value);
  };

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredEvents = Object.entries(events).filter(([date, event]) => {
    return filter === 'All' || event.type === filter;
  });

  const days = generateCalendar();
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  return (
    <div className="App">
      <header>
        <button onClick={handlePrevMonth}>Previous</button>
        <h2>{monthName} {year}</h2>
        <button onClick={handleNextMonth}>Next</button>
      </header>
      <div className="calendar">
        {daysOfWeek.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const dateKey = day ? `${year}-${currentMonth.getMonth() + 1}-${day}` : null;
          return (
            <div
              key={index}
              className={`day ${day ? '' : 'empty'} ${dateKey && events[dateKey] ? 'has-event' : ''}`}
              onClick={() => handleDateClick(day)}
            >
              {day}
              {dateKey && events[dateKey] && (
                <div className="event">{events[dateKey].text}</div>
              )}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="event-form">
          <textarea
            value={eventText}
            onChange={handleEventTextChange}
            placeholder="Add or edit event"
          />
          <select value={eventType} onChange={handleEventTypeChange} className="event-type-select">
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
          </select>
          <div className="form-buttons">
            <button onClick={handleEventSave} className="save-btn">Save</button>
            <button onClick={handleEventDelete} className="delete-btn">Delete</button>
            <button onClick={() => setSelectedDate(null)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
      <div className="events-details">
        <h3>Event Details</h3>
        <div className="filter">
          <label>Filter by type:</label>
          <select value={filter} onChange={handleFilterChange} className="filter-select">
            <option value="All">All</option>
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
          </select>
        </div>
        {filteredEvents.length > 0 ? (
          <ul>
            {filteredEvents.map(([date, event]) => (
              <li key={date}>
                <strong>{date}</strong>: {event.text} <em>({event.type})</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events to display.</p>
        )}
      </div>
    </div>
  );
}

export default App;
