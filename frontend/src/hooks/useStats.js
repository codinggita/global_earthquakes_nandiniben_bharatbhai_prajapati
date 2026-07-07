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
        monthly, type, country, network, 
        count, highestMag, avgDepth, avgMag, deepest, reviewed
      ] = await Promise.all([
        statsService.getMonthlyCount(),
        statsService.getTypeCount(),
        statsService.getCountryCount(),
        statsService.getNetworkCount(),
        statsService.getCount(),
        statsService.getHighestMagnitude(),
        statsService.getAverageDepth(),
        statsService.getAverageMagnitude(),
        statsService.getDeepest(),
        statsService.getReviewedCount(),
      ]);

      setData({
        monthlyCount: monthly.data || monthly,
        typeCount: type.data || type,
        countryCount: country.data || country,
        networkCount: network.data || network,
        summary: {
          count: count.count || count.data?.count || 0,
          highestMag: highestMag.magnitude || highestMag.data?.magnitude || 0,
          avgDepth: avgDepth.averageDepth || avgDepth.data?.averageDepth || 0,
          avgMag: avgMag.averageMagnitude || avgMag.data?.averageMagnitude || 0,
          deepest: deepest.depth || deepest.data?.depth || 0,
          reviewed: reviewed.count || reviewed.data?.count || 0
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
