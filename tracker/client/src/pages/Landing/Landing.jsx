import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/Layout/AppShell.jsx';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="landing">
        <div className="landing-grid" />
        <div className="landing-content">
          <span className="landing-eyebrow mono">PRIVATE · REAL-TIME · CONSENT-BASED</span>
          <h1>Private live location,<br />shared on your terms.</h1>
          <p className="landing-sub">
            Generate a secure link, send it to someone you trust, and see their
            location the moment they choose to share it. Nothing tracks without consent.
          </p>
          <button className="btn-primary landing-cta" onClick={() => navigate('/create')}>
            Create Tracking Link
          </button>
          <div className="landing-features mono">
            <span>SECURE</span>
            <span>·</span>
            <span>REAL-TIME</span>
            <span>·</span>
            <span>CONSENT-BASED</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
