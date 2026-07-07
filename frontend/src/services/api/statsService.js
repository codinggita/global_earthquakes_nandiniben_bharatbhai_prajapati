import axiosInstance from './axiosInstance';

const statsService = {
  getCount: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/count');
    return res.data;
  },
  getHighestMagnitude: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/highest-magnitude');
    return res.data;
  },
  getAverageDepth: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/average-depth');
    return res.data;
  },
  getMonthlyCount: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/monthly-count');
    return res.data;
  },
  getTypeCount: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/type-count');
    return res.data;
  },
};

export default statsService;
