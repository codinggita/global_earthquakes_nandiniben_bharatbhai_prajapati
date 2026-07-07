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
  getAverageMagnitude: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/average-magnitude');
    return res.data;
  },
  getDeepest: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/deepest');
    return res.data;
  },
  getCountryCount: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/country-count');
    return res.data;
  },
  getNetworkCount: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/network-count');
    return res.data;
  },
  getReviewedCount: async () => {
    const res = await axiosInstance.get('/stats/earthquakes/reviewed-count');
    return res.data;
  },
};

export default statsService;
