import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEarthquakes, fetchDashboardData, selectEarthquakeData } from '@features/earthquake/earthquakeSlice';

const useEarthquakes = (fetchOnMount = false, dashboardData = false) => {
  const dispatch = useDispatch();
  const data = useSelector(selectEarthquakeData);

  useEffect(() => {
    if (fetchOnMount) {
      if (dashboardData) {
        dispatch(fetchDashboardData());
      } else {
        dispatch(fetchEarthquakes({ page: 1, limit: 10 }));
      }
    }
  }, [dispatch, fetchOnMount, dashboardData]);

  const loadMore = (params) => dispatch(fetchEarthquakes(params));
  const refreshDashboard = () => dispatch(fetchDashboardData());

  return { ...data, loadMore, refreshDashboard };
};

export default useEarthquakes;
