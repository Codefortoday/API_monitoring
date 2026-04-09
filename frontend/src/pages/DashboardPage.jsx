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
    <div className="page-inner">
      <div className="page-header">
        <h1>Monitor Management</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="dashboard-grid">
        <div className="card">
          <h2>Add New Monitor</h2>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="monitor-name">Monitor Name</label>
              <input
                id="monitor-name"
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="monitor-url">URL</label>
              <input
                id="monitor-url"
                type="url"
                value={form.url}
                onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
                required
                className="input-field"
                placeholder="https://example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="check-interval">Check Interval (seconds)</label>
              <input
                id="check-interval"
                type="number"
                value={form.check_interval}
                onChange={(event) => setForm((prev) => ({ ...prev, check_interval: Number(event.target.value) }))}
                min="15"
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary full-width">
              {loading ? 'Saving monitor...' : 'Create Monitor'}
            </button>
          </form>
        </div>

        <div className="card">
          <div className="section-header">
            <h2>Your Monitors</h2>
            <button className="btn btn-secondary" onClick={loadMonitors}>
              Refresh
            </button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-head-cell">Name</th>
                  <th className="table-head-cell">URL</th>
                  <th className="table-head-cell">Interval</th>
                  <th className="table-head-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitors.map((monitor) => (
                  <tr key={monitor.id}>
                    <td data-label="Name">{monitor.name}</td>
                    <td data-label="URL">{monitor.url}</td>
                    <td data-label="Interval">{monitor.check_interval}s</td>
                    <td className="table-action-cell" data-label="Actions">
                      <button className="btn btn-primary" onClick={() => handleStatus(monitor.id)}>
                        View Status
                      </button>
                    </td>
                  </tr>
                ))}
                {monitors.length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-row">
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
        <div className="card status-card">
          <h2>Monitor status for {currentMonitor.name}</h2>

          <div className="stats-grid">
            <div className="status-box">
              <strong>URL</strong><br />
              {currentMonitor.url}
            </div>
            <div className="status-box">
              <strong>Last checked</strong><br />
              {statusData.stats.last_checked_at || 'No data yet'}
            </div>
            <div className="status-box">
              <strong>Success Rate</strong><br />
              {statusData.stats.success_count}/{statusData.stats.total_checks} successful
            </div>
          </div>

          <h3>Recent checks</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-head-cell">Checked At</th>
                  <th className="table-head-cell">Status</th>
                  <th className="table-head-cell">Response Time</th>
                  <th className="table-head-cell">Success</th>
                </tr>
              </thead>
              <tbody>
                {statusData.recent_checks.map((check, index) => (
                  <tr key={index}>
                    <td data-label="Checked At">{new Date(check.checked_at).toLocaleString()}</td>
                    <td data-label="Status">{check.status_code}</td>
                    <td data-label="Response Time">{check.response_time_ms} ms</td>
                    <td data-label="Success">{check.success ? 'Yes' : 'No'}</td>
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
