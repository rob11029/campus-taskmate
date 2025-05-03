import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarGrid.css';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarGrid = ({ tasks }) => {
  const [view, setView] = useState('month');

  const events = tasks
    .filter(task => task.dueDate)
    .map(task => {
      const startDate = new Date(task.dueDate);
      return {
        title: task.title,
        start: startDate,
        end: new Date(startDate.getTime() + 60 * 60 * 1000),
      };
    });

  return (
    <div
      className="calendar-container"
      style={{
        height: '90vh',
        width: '100%',
        padding: '1rem',
        overflow: 'hidden',
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        views={['month', 'week', 'day', 'agenda']}
        startAccessor="start"
        endAccessor="end"
        defaultDate={new Date()}
        popup
        style={{
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '1rem',
        }}
      />
    </div>
  );
};

export default CalendarGrid;
