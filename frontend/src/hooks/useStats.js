import { useState, useEffect, useCallback } from 'react';
import statsService from '@services/api/statsService';

// Hook to fetch various statistics for the dashboard
const useStats = () => {
  const [data, setData] = useState({
    monthlyCount: [],
    typeCount: [], // placeholder for future magnitude distribution
    countryCount: [],
    networkCount: [],
    highestMagnitudeList: [],
    summary: {
      count: 0,
      highestMag: 0,
      avgDepth: 0,
      avgMag: 0,
      deepest: 0,
      reviewed: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [monthly, country, highest, global] = await Promise.all([
        statsService.getMonthlyCount(),
        statsService.getCountryCount(),
        statsService.getHighestMagnitude(10),
        statsService.getGlobalStats(),
      ]);

      const globalData = global.data || global;
      const monthlyRaw = monthly.data?.trends || monthly.data || monthly || [];
      const countryRaw = country.data?.countries || country.data || country || [];
      const highestRaw = highest.data || highest || [];

      setData({
        monthlyCount: Array.isArray(monthlyRaw) ? monthlyRaw : [],
        typeCount: [], // still empty – can be filled with distribution logic later
        countryCount: Array.isArray(countryRaw) ? countryRaw : [],
        networkCount: [],
        highestMagnitudeList: Array.isArray(highestRaw) ? highestRaw : [],
        summary: {
          count: globalData.totalCount || 0,
          highestMag: globalData.highestMagnitude?.magnitude || 0,
          avgDepth: globalData.averageDepth || 0,
          avgMag: globalData.averageMagnitude || 0,
          deepest: globalData.deepestEarthquake?.depth || 0,
          reviewed: 0,
        },
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
