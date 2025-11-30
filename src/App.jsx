import { Link, Routes, Route } from 'react-router-dom'
import CustomersPage from './CustomersPage.jsx'
import TrainingsPage from './TrainingsPage.jsx'
import CalendarPage from './CalendarPage.jsx'
import './index.css';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui', padding: 16 }}>

      <nav style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/customers">Asiakkaat</Link>
        <Link to="/trainings">Harjoitukset</Link>
        <Link to="/calendar">Kalenteri</Link>
      </nav>

      <Routes>
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/" element={<p>Valitse sivu ylhäältä.</p>} />
      </Routes>
    </div>
  )
}
