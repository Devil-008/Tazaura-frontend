import './Input.css';

export default function Input({ label, error, icon, ...props }) {
  return (
    <div className="taz-field">
      {label && <label className="taz-label">{label}</label>}
      <div className={`taz-input-wrap${icon ? ' has-icon' : ''}`}>
        {icon && <span className="taz-input-icon">{icon}</span>}
        <input className={`taz-input${error ? ' taz-input--error' : ''}`} {...props} />
      </div>
      {error && <p className="taz-field-error">{error}</p>}
    </div>
  );
}
