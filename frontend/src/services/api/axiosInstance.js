import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, TOKEN_KEY } from '@config/constants';

// ─── Base Instance ────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Request construction error (e.g. cancelled before sending)
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap the response data for convenience
    return response;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      // Network error / server unreachable
      console.error('[Axios] Network error — server may be unreachable.');
      return Promise.reject(error);
    }

    const { status } = response;

    switch (status) {
      case 401:
        // Token expired or invalid — clear local storage
        // Redirect to login will be handled by the Router guard
        localStorage.removeItem(TOKEN_KEY);
        window.dispatchEvent(new Event('auth:logout'));
        break;

      case 403:
        console.warn('[Axios] 403 Forbidden — insufficient permissions.');
        break;

      case 500:
        console.error('[Axios] 500 Internal Server Error.');
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
