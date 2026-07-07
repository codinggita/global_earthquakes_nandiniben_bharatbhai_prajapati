import axiosInstance from './axiosInstance';

// ─── Auth API Service ─────────────────────────────────────────────────────────
const authService = {
  /**
   * POST /api/auth/login
   * @param {{ email: string, password: string }} credentials
   * @returns {{ token: string, user: object }}
   */
  login: async (credentials) => {
    const res = await axiosInstance.post('/api/auth/login', credentials);
    return res.data;
  },

  /**
   * POST /api/auth/register
   * @param {{ name: string, email: string, password: string }} userData
   * @returns {{ token: string, user: object }}
   */
  register: async (userData) => {
    const res = await axiosInstance.post('/api/auth/register', userData);
    return res.data;
  },

  /**
   * GET /api/auth/me — fetch currently authenticated user
   */
  getMe: async () => {
    const res = await axiosInstance.get('/api/auth/me');
    return res.data;
  },
};

export default authService;
