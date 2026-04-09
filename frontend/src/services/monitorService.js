import api from '../api';

export const createMonitor = (payload) => api.post('/monitors', payload);
export const getMonitors = () => api.get('/monitors');
export const getMonitorStatus = (id) => api.get(`/monitors/${id}/status`);
