import axiosInstance from './axiosInstance';

const earthquakeService = {
  // ── Basic CRUD ─────────────────────────────────────────────────────────────
  getAll: async (params = {}) => {
    // params can include page, limit, sort, country, status, etc.
    const res = await axiosInstance.get('/api/earthquakes', { params });
    return res.data; // Usually { data: [...], pagination: {...} }
  },
  getById: async (id) => {
    const res = await axiosInstance.get(`/api/earthquakes/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/api/earthquakes', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosInstance.patch(`/api/earthquakes/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosInstance.delete(`/api/earthquakes/${id}`);
    return res.data;
  },

  // ── Dashboard / Info endpoints ─────────────────────────────────────────────
  getRecent: async () => {
    // Sort by newest, limit to 20
    const res = await axiosInstance.get('/api/earthquakes', {
      params: { sort: '-time', limit: 20 }
    });
    return res.data;
  },
  getCritical: async () => {
    // High magnitude (>=6.0) recent earthquakes
    const res = await axiosInstance.get('/api/earthquakes', {
      params: { 'magnitude[gte]': 6.0, sort: '-time', limit: 10 }
    });
    return res.data;
  },
  getHighMagnitude: async () => {
    const res = await axiosInstance.get('/api/earthquakes', {
      params: { sort: '-magnitude', limit: 10 }
    });
    return res.data;
  }
};

export default earthquakeService;
