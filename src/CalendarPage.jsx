import { useEffect, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import fi from 'date-fns/locale/fi';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  fi: fi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    loadTrainings();
  }, []);

  async function loadTrainings() {
    try {
      const res = await fetch(
        'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/trainings'
      );
      const data = await res.json();

      const trainingsWithCustomer = await Promise.all(
        data._embedded.trainings.map(async (t) => {
          try {
            const custRes = await fetch(t._links.customer.href);
            const custData = await custRes.json();
            return { ...t, customer: custData };
          } catch {
            return { ...t, customer: null };
          }
        })
      );

      const mappedEvents = trainingsWithCustomer.map((t) => {
        const start = new Date(t.date);
        const durationMinutes = Number(t.duration) || 0;

        const end = new Date(start.getTime() + durationMinutes * 60000);

        const customerName = t.customer
          ? `${t.customer.firstname} ${t.customer.lastname}`
          : 'Tuntematon asiakas';

        return {
          id: t.id,
          title: `${t.activity} – ${customerName}`,
          start,
          end,
          allDay: false,
        };
      });

      setEvents(mappedEvents);
    } catch (err) {
      setError(String(err));
    }
  }

  if (error) return <p style={{ padding: 16 }}>Virhe: {error}</p>;

  return (
    <div style={{ padding: 16, minHeight: '100vh' }}>
      <h2>Harjoituskalenteri</h2>

      <div
        style={{
          height: '70vh',
          background: '#fff',
          borderRadius: 8,
          padding: 8,
        }}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          views={['day', 'week', 'month']}
          view={view}
          onView={(nextView) => setView(nextView)}
          defaultView={Views.WEEK}
          culture="fi"
          showMultiDayTimes
        />
      </div>
    </div>
  );
}
