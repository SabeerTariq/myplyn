export default function DataTable({ columns, data, onRowClick, emptyMessage }) {
  if (!data?.length) {
    return <p className="text-muted text-center" style={{ padding: '32px 0' }}>{emptyMessage || 'No data found'}</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th key={col.key} className="text-muted" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600 }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: onRowClick ? 'pointer' : 'default',
              }}
              className={onRowClick ? 'hover:bg-[var(--surface-2)]' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '12px 16px' }}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
