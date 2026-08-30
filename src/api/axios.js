import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tazaura.in/api/v1',
  timeout: 60000,
});

// ── Request: attach JWT + trigger global loader ─────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tazaura_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Dispatch event so LoaderContext can react
    window.dispatchEvent(new CustomEvent('api:loading', { detail: true }));
    return config;
  },
  (error) => {
    window.dispatchEvent(new CustomEvent('api:loading', { detail: false }));
    return Promise.reject(error);
  },
);

// ── Response: stop loader + global error toast ──────────────────────────
api.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new CustomEvent('api:loading', { detail: false }));
    return response;
  },
  (error) => {
    window.dispatchEvent(new CustomEvent('api:loading', { detail: false }));

    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';

    // 401 → auto logout
    if (error?.response?.status === 401) {
      localStorage.removeItem('tazaura_token');
      localStorage.removeItem('tazaura_user');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    // Dispatch so Toast can show it globally
    window.dispatchEvent(new CustomEvent('api:error', { detail: message }));

    return Promise.reject(error);
  },
);

export default api;
