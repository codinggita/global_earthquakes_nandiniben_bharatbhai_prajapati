import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import earthquakeService from '@services/api/earthquakeService';
import statsService from '@services/api/statsService';

// ── Async Thunks ─────────────────────────────────────────────────────────────
export const fetchEarthquakes = createAsyncThunk(
  'earthquake/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await earthquakeService.getAll(params);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch earthquakes');
    }
  }
);

export const createEarthquake = createAsyncThunk(
  'earthquake/create',
  async (data, { rejectWithValue }) => {
    try {
      return await earthquakeService.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create earthquake');
    }
  }
);

export const updateEarthquake = createAsyncThunk(
  'earthquake/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await earthquakeService.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update earthquake');
    }
  }
);

export const deleteEarthquake = createAsyncThunk(
  'earthquake/delete',
  async (id, { rejectWithValue }) => {
    try {
      return await earthquakeService.delete(id);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete earthquake');
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'earthquake/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [recent, critical, globalStats] = await Promise.all([
        earthquakeService.getRecent(),
        earthquakeService.getCritical(),
        statsService.getGlobalStats(),
      ]);

      const statsData = globalStats.data || globalStats;

      return {
        recent: recent.data || recent,
        critical: critical.data || critical,
        stats: {
          total: statsData.totalCount || 0,
          highestMag: statsData.highestMagnitude?.magnitude || 0,
          avgDepth: statsData.averageDepth || 0,
        }
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

const initialState = {
  list: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
  recent: [],
  critical: [],
  stats: { total: 0, highestMag: 0, avgDepth: 0 },
  loading: false,          // skeleton on first load of earthquake list
  listLoading: false,      // overlay spinner when changing pages
  dashboardLoading: false, // loading state for dashboard (won't affect earthquake table)
  error: null,
  dashboardError: null,
};

// ── Slice ────────────────────────────────────────────────────────────────────
const earthquakeSlice = createSlice({
  name: 'earthquake',
  initialState,
  reducers: {
    clearEarthquakeError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // fetchEarthquakes
      .addCase(fetchEarthquakes.pending, (state) => {
        state.error = null;
        // If list is already populated, use listLoading (overlay) instead of clearing the table
        if (state.list.length === 0) {
          state.loading = true;
        } else {
          state.listLoading = true;
        }
      })
      .addCase(fetchEarthquakes.fulfilled, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.list = action.payload.data || [];
        // Normalize backend pagination keys to frontend expected keys
        if (action.payload.pagination) {
          const p = action.payload.pagination;
          state.pagination = {
            page: p.currentPage || p.page || 1,
            totalPages: p.totalPages || 1,
            total: p.totalRecords || p.total || 0,
            hasNext: p.hasNext || false,
            hasPrev: p.hasPrev || false,
          };
        }
      })
      .addCase(fetchEarthquakes.rejected, (state, action) => {
        state.loading = false;
        state.listLoading = false;
        state.error = action.payload;
      })
      
      // fetchDashboardData — uses its own loading flag, doesn't touch list loading
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.recent = action.payload.recent;
        state.critical = action.payload.critical;
        state.stats = action.payload.stats;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });
  },
});

export const { clearEarthquakeError } = earthquakeSlice.actions;

export const selectEarthquakeData = (state) => state.earthquake;

export default earthquakeSlice.reducer;
