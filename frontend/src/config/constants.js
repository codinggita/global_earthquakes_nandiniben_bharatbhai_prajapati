// ─── API ────────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_TIMEOUT = 15_000; // ms

// ─── Auth ────────────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'eq_auth_token';
export const REFRESH_TOKEN_KEY = 'eq_refresh_token';
export const USER_KEY = 'eq_user';

// ─── Pagination ──────────────────────────────────────────────────────────────
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Earthquake ──────────────────────────────────────────────────────────────
export const MAGNITUDE_LEVELS = {
  MICRO: { label: 'Micro', min: 0, max: 2 },
  MINOR: { label: 'Minor', min: 2, max: 4 },
  MODERATE: { label: 'Moderate', min: 4, max: 6 },
  STRONG: { label: 'Strong', min: 6, max: 7 },
  MAJOR: { label: 'Major', min: 7, max: 8 },
  GREAT: { label: 'Great', min: 8, max: Infinity },
};

// ─── App ─────────────────────────────────────────────────────────────────────
export const APP_NAME = 'Global Earthquake Analytics';
export const APP_VERSION = '1.0.0';

// ─── Routes ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  EARTHQUAKES: '/earthquakes',
  ANALYTICS: '/analytics',
  PROFILE: '/profile',
  NOT_FOUND: '*',
};

// ─── HTTP Status Codes ───────────────────────────────────────────────────────
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};

// ─── Theme ───────────────────────────────────────────────────────────────────
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};
