export default function DataTable({ columns, data, onRowClick, emptyMessage }) {
  if (!data?.length) {
    return (
      <div className="dashboard-table-card">
        <p className="text-muted text-center" style={{ padding: '32px 0' }}>{emptyMessage || 'No data found'}</p>
      </div>
    );
  }

  const mobileColumns = columns.slice(0, 3);

  return (
    <div className="dashboard-table-card">
      <div className="dashboard-table-cards">
        {data.map((row, idx) => (
          <button
            key={row.id || idx}
            type="button"
            className="dashboard-table-card-row"
            onClick={() => onRowClick?.(row)}
          >
            {mobileColumns.map((col) => (
              <div key={col.key}>
                <div className="dashboard-table-card-label">{col.label}</div>
                <div className="dashboard-table-card-value">
                  {col.render ? col.render(row) : row[col.key]}
                </div>
              </div>
            ))}
          </button>
        ))}
      </div>
      <div className="dashboard-table-wrap dashboard-table-wrap--with-cards">
        <table className="dashboard-data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'dashboard-row-clickable' : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
