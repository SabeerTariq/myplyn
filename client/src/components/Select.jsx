export default function Select({ className = '', wrapperClassName = '', ...props }) {
  return (
    <div className={`select-wrap ${wrapperClassName}`.trim()}>
      <select className={`select ${className}`.trim()} {...props} />
    </div>
  );
}
