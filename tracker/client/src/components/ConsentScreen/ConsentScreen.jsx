import './ConsentScreen.css';

export default function ConsentScreen({ label, onAccept, onDecline }) {
  return (
    <div className="consent-screen glass">
      <div className="consent-icon">◉</div>
      <h2>Location request</h2>
      <p>
        {label ? <><strong>{label}</strong> has</> : 'Someone has'} invited you to share your live location.
        Your location stays private until you approve sharing, and remains active only while this session runs.
      </p>
      <div className="consent-actions">
        <button className="btn-primary" onClick={onAccept}>Share My Location</button>
        <button className="btn-ghost" onClick={onDecline}>Decline</button>
      </div>
    </div>
  );
}
