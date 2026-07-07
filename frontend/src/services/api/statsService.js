import axiosInstance from './axiosInstance';

const statsService = {
  getGlobalStats: async () => {
    const res = await axiosInstance.get('/api/analytics/stats');
    return res.data;
  },
  getHighestMagnitude: async (limit = 10) => {
    const res = await axiosInstance.get(`/api/analytics/highest-magnitude?limit=${limit}`);
    return res.data;
  },
  getCountryCount: async () => {
    const res = await axiosInstance.get('/api/analytics/by-country');
    return res.data;
  },
  getMonthlyCount: async () => {
    const res = await axiosInstance.get('/api/analytics/monthly-trends');
    return res.data;
  }
};

export default statsService;
