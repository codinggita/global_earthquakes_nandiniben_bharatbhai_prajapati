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

export const fetchDashboardData = createAsyncThunk(
  'earthquake/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const [recent, critical, count, highestMag, avgDepth] = await Promise.all([
        earthquakeService.getRecent(),
        earthquakeService.getCritical(),
        statsService.getCount(),
        statsService.getHighestMagnitude(),
        statsService.getAverageDepth(),
      ]);

      return {
        recent: recent.data || recent,
        critical: critical.data || critical,
        stats: {
          total: count.count || count.data?.count || 0,
          highestMag: highestMag.magnitude || highestMag.data?.magnitude || 0,
          avgDepth: avgDepth.averageDepth || avgDepth.data?.averageDepth || 0,
        }
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  list: [],
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  recent: [],
  critical: [],
  stats: { total: 0, highestMag: 0, avgDepth: 0 },
  loading: false,
  error: null,
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarthquakes.fulfilled, (state, action) => {
        state.loading = false;
        // Adjust based on actual backend response format (e.g., action.payload.data vs action.payload)
        state.list = action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchEarthquakes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // fetchDashboardData
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload.recent;
        state.critical = action.payload.critical;
        state.stats = action.payload.stats;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEarthquakeError } = earthquakeSlice.actions;

export const selectEarthquakeData = (state) => state.earthquake;

export default earthquakeSlice.reducer;
