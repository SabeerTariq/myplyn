export default function PageHeader({ greeting, title, lead, actions }) {
  return (
    <div className="dashboard-page-header">
      <div>
        {greeting && <div className="page-greeting">{greeting}</div>}
        <h1 className="page-title">{title}</h1>
        {lead && <p className="dashboard-page-lead">{lead}</p>}
      </div>
      {actions && <div className="dashboard-page-actions">{actions}</div>}
    </div>
  );
}
