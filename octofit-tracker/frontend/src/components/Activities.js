import React, { useEffect, useState } from 'react';

const endpointBase = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : '';

function Activities() {
  // The following URL is used for the API endpoint
  const apiUrl = 'https://-8000.app.github.dev/api/activities';  
  const endpoint = `${endpointBase}/api/activities/`;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const normalize = (payload) => {
      if (Array.isArray(payload)) return payload;
      return payload?.results ?? payload?.data ?? [];
    };

    const fetchData = async () => {
      console.log('[Activities] fetching endpoint', endpoint);
      try {
        const response = await fetch(endpoint);
        const json = await response.json();
        console.log('[Activities] fetched data', json);
        setData(normalize(json));
      } catch (fetchError) {
        console.error('[Activities] fetch error', fetchError);
        setError(fetchError.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const renderTable = (items) => {
    if (items.length === 0) return <div className="alert alert-secondary">No activities found.</div>;

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
      <h2 className="mb-4">Activities</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-muted">Loading activities...</div>
      ) : (
        renderTable(data)
      )}
    </div>
  );
}

export default Activities;
