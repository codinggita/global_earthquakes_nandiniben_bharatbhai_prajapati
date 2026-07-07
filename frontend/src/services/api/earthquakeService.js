import axiosInstance from './axiosInstance';

const earthquakeService = {
  // ── Basic CRUD ─────────────────────────────────────────────────────────────
  getAll: async (params = {}) => {
    // params can include page, limit, sort, country, status, etc.
    const res = await axiosInstance.get('/earthquakes', { params });
    return res.data; // Usually { data: [...], pagination: {...} }
  },
  getById: async (id) => {
    const res = await axiosInstance.get(`/earthquakes/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await axiosInstance.post('/earthquakes', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await axiosInstance.patch(`/earthquakes/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await axiosInstance.delete(`/earthquakes/${id}`);
    return res.data;
  },

  // ── Dashboard / Info endpoints ─────────────────────────────────────────────
  getRecent: async () => {
    const res = await axiosInstance.get('/earthquakes/recent');
    return res.data;
  },
  getCritical: async () => {
    const res = await axiosInstance.get('/earthquakes/critical');
    return res.data;
  },
  getHighMagnitude: async () => {
    const res = await axiosInstance.get('/earthquakes/high-magnitude');
    return res.data;
  }
};

export default earthquakeService;
