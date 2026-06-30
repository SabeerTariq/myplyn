export default function Icon({ name, size = 21, filled = false, className = '', style = {} }) {
  return (
    <span
      className={`material-symbols-rounded ${filled ? 'filled' : ''} ${className}`.trim()}
      style={{
        fontSize: size,
        width: size,
        height: size,
        ...style,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
