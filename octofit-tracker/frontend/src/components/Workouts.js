import React, { useEffect, useState } from 'react';

const endpointBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : '';

function Workouts() {
  const endpoint = `${endpointBase}/api/workouts/`;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const normalize = (payload) => {
      if (Array.isArray(payload)) return payload;
      return payload?.results ?? payload?.data ?? [];
    };

    const fetchData = async () => {
      console.log('[Workouts] fetching endpoint', endpoint);
      try {
        const response = await fetch(endpoint);
        const json = await response.json();
        console.log('[Workouts] fetched data', json);
        setData(normalize(json));
      } catch (fetchError) {
        console.error('[Workouts] fetch error', fetchError);
        setError(fetchError.message || 'Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const renderTable = (items) => {
    if (items.length === 0) return <div className="alert alert-secondary">No workouts found.</div>;

    const columns = Object.keys(items[0] || {});
    return (
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id ?? item.pk ?? index}>
                {columns.map((col) => (
                  <td key={col}>{JSON.stringify(item[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h2 className="mb-4">Workouts</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-muted">Loading workouts...</div>
      ) : (
        renderTable(data)
      )}
    </div>
  );
}

export default Workouts;
