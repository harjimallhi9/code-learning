import { Link } from 'react-router-dom';
import './AppShell.css';

export default function AppShell({ children, systemOnline = true }) {
  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <Link to="/" className="app-shell-brand">
          <span className="app-shell-logo">◉</span>
          <span>NOMAD</span>
        </Link>
        <div className="app-shell-status mono">
          <span className={`shell-dot ${systemOnline ? 'shell-dot--online' : ''}`} />
          {systemOnline ? 'SYSTEM ONLINE' : 'CONNECTING'}
        </div>
      </header>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
