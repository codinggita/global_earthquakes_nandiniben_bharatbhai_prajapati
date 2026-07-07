import { useState, useEffect, useCallback } from 'react';
import statsService from '@services/api/statsService';

const useStats = () => {
  const [data, setData] = useState({
    monthlyCount: [],
    typeCount: [],
    countryCount: [],
    networkCount: [],
    summary: {
      count: 0,
      highestMag: 0,
      avgDepth: 0,
      avgMag: 0,
      deepest: 0,
      reviewed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all analytics data in parallel
      const [
        monthly, country, highest, global
      ] = await Promise.all([
        statsService.getMonthlyCount(),
        statsService.getCountryCount(),
        statsService.getHighestMagnitude(10),
        statsService.getGlobalStats()
      ]);

      const globalData = global.data || global;

      setData({
        monthlyCount: monthly.data || monthly,
        typeCount: [], // Type count not supported natively by this backend
        countryCount: country.data || country,
        networkCount: [], // Not supported
        summary: {
          count: globalData.totalCount || 0,
          highestMag: globalData.highestMagnitude || 0,
          avgDepth: globalData.averageDepth || 0,
          avgMag: globalData.averageMagnitude || 0,
          deepest: globalData.deepestEarthquake || 0,
          reviewed: 0 // Not supported
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
};

export default useStats;
