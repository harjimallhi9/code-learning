import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing/Landing.jsx';
import CreateSession from './pages/CreateSession/CreateSession.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Session from './pages/Session/Session.jsx';
import Share from './pages/Share/Share.jsx';
import History from './pages/History/History.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/create" element={<CreateSession />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/session/:sessionId" element={<Session />} />
      <Route path="/share/:shareToken" element={<Share />} />
      <Route path="/history/:sessionId" element={<History />} />
    </Routes>
  );
}
