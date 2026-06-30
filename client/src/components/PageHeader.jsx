export default function PageHeader({ greeting, title, actions }) {
  return (
    <div className="flex items-end justify-between flex-wrap" style={{ gap: 16, marginBottom: 22 }}>
      <div>
        {greeting && <div className="page-greeting">{greeting}</div>}
        <h1 className="page-title">{title}</h1>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}
