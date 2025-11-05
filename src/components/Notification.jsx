import { useEffect } from 'react';

export default function Notification({ type = 'success', message, onClose, open }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), 3000);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const cls = type === 'error' ? 'alert-danger' : 'alert-success';

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 2000 }}>
      <div className={`alert ${cls} d-flex align-items-center`} role="alert">
        <div>{message}</div>
        <button type="button" className="btn-close ms-3" aria-label="Close" onClick={() => onClose && onClose()} />
      </div>
    </div>
  );
}
