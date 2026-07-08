import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchEarthquakes, fetchDashboardData, selectEarthquakeData,
  createEarthquake, updateEarthquake, deleteEarthquake
} from '@features/earthquake/earthquakeSlice';

const useEarthquakes = (fetchOnMount = false, dashboardData = false) => {
  const dispatch = useDispatch();
  const data = useSelector(selectEarthquakeData);
  const { list, pagination, loading, listLoading, error, recent, critical, stats } = data;

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
  const createRecord = (payload) => dispatch(createEarthquake(payload));
  const updateRecord = (id, payload) => dispatch(updateEarthquake({ id, data: payload }));
  const deleteRecord = (id) => dispatch(deleteEarthquake(id));

  return { ...data, loadMore, refreshDashboard, createRecord, updateRecord, deleteRecord };
};

export default useEarthquakes;
