import { useState } from 'react';
import './ShareLink.css';

export default function ShareLink({ url }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Live location request', url }).catch(() => {});
    } else {
      copy();
    }
  };

  return (
    <div className="share-link">
      <div className="share-link-url mono">{url}</div>
      <div className="share-link-actions">
        <button className="btn-ghost" onClick={copy}>{copied ? 'LINK COPIED' : 'Copy Link'}</button>
        <button className="btn-primary" onClick={share}>Share</button>
      </div>
    </div>
  );
}
