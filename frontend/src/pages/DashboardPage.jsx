import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMonitor, getMonitors, getMonitorStatus } from '../services/monitorService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [monitors, setMonitors] = useState([]);
  const [currentMonitor, setCurrentMonitor] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [form, setForm] = useState({ name: '', url: '', check_interval: 60 });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMonitors = async () => {
    setError('');
    try {
      const response = await getMonitors();
      const data = response.data;

      if (data.success) {
        setMonitors(data.monitors);
      } else {
        setError('Failed to load monitors');
      }
    } catch (err) {
      setError('Unable to load monitors. Please refresh or login again.');
      console.error('Load monitors error:', err);
    }
  };

  useEffect(() => {
    loadMonitors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const response = await createMonitor(form);
      const data = response.data;

      if (data.success) {
        setMessage('Monitor created successfully.');
        setForm({ name: '', url: '', check_interval: 60 });
        await loadMonitors();
      } else {
        setError(data.message || 'Unable to create monitor.');
      }
    } catch (err) {
      setError('Unable to create monitor. Please check your connection.');
      console.error('Create monitor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id) => {
    setError('');
    setStatusData(null);
    try {
      const response = await getMonitorStatus(id);
      const data = response.data;

      if (data.success) {
        setCurrentMonitor(data.monitor);
        setStatusData(data);
      } else {
        setError(data.message || 'Unable to load monitor status.');
      }
    } catch (err) {
      setError('Unable to load monitor status. Please check your connection.');
      console.error('Load status error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Monitor Management</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>{error}</div>}
      {message && <div style={{ color: 'green', marginBottom: '20px', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>{message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Add New Monitor</h2>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="monitor-name" style={{ display: 'block', marginBottom: '5px' }}>Monitor Name</label>
              <input
                id="monitor-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="monitor-url" style={{ display: 'block', marginBottom: '5px' }}>URL</label>
              <input
                id="monitor-url"
                type="url"
                value={form.url}
                onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="https://example.com"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="check-interval" style={{ display: 'block', marginBottom: '5px' }}>Check Interval (seconds)</label>
              <input
                id="check-interval"
                type="number"
                value={form.check_interval}
                onChange={(event) => setForm((prev) => ({ ...prev, check_interval: Number(event.target.value) }))}
                min="15"
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Saving monitor...' : 'Create Monitor'}
            </button>
          </form>
        </div>

        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Your Monitors</h2>
            <button
              onClick={loadMonitors}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>URL</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Interval</th>
                  <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitors.map((monitor) => (
                  <tr key={monitor.id} style={{ border: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{monitor.name}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{monitor.url}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{monitor.check_interval}s</td>
                    <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                      <button
                        onClick={() => handleStatus(monitor.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        View Status
                      </button>
                    </td>
                  </tr>
                ))}
                {monitors.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '12px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      No monitors added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {statusData && currentMonitor && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Monitor status for {currentMonitor.name}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <strong>URL</strong><br />
              {currentMonitor.url}
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <strong>Last checked</strong><br />
              {statusData.stats.last_checked_at || 'No data yet'}
            </div>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <strong>Success Rate</strong><br />
              {statusData.stats.success_count}/{statusData.stats.total_checks} successful
            </div>
          </div>

          <h3>Recent checks</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Checked At</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Response Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>Success</th>
                </tr>
              </thead>
              <tbody>
                {statusData.recent_checks.map((check, index) => (
                  <tr key={index} style={{ border: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                      {new Date(check.checked_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{check.status_code}</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{check.response_time_ms} ms</td>
                    <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>{check.success ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
