import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  ...props
}) {
  return (
    <button
      className={`taz-btn taz-btn--${variant} taz-btn--${size}${fullWidth ? ' taz-btn--full' : ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="taz-btn-spinner" /> : children}
    </button>
  );
}
