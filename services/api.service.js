import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

/**
 * Core API client with automatic token injection and refresh
 */
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this._isRefreshing = false;
    this._refreshSubscribers = [];
  }

  async _getHeaders(requiresAuth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth) {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async _request(endpoint, options = {}, requiresAuth = true) {
    const headers = await this._getHeaders(requiresAuth);
    const config = { headers, ...options };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      // Token expired — attempt refresh
      if (response.status === 401 && requiresAuth) {
        return this._handleTokenRefresh(endpoint, options);
      }

      if (!response.ok) {
        throw { message: data.message || 'Request failed', errors: data.errors, status: response.status };
      }

      return data;
    } catch (error) {
      if (error.status) throw error;
      throw { message: error.message || 'Network error. Check your connection.', status: 0 };
    }
  }

  async _handleTokenRefresh(endpoint, options) {
    if (this._isRefreshing) {
      return new Promise((resolve, reject) => {
        this._refreshSubscribers.push({ resolve, reject, endpoint, options });
      });
    }

    this._isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) throw new Error('No refresh token');

      const data = await this.post('/auth/refresh-token', { refreshToken }, false);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.data.refreshToken);

      // Retry pending requests
      this._refreshSubscribers.forEach(({ resolve, endpoint: ep, options: opts }) => {
        resolve(this._request(ep, opts, true));
      });

      return this._request(endpoint, options, true);
    } catch (error) {
      this._refreshSubscribers.forEach(({ reject }) => reject(error));
      // Force logout
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      throw { message: 'Session expired. Please login again.', status: 401, requiresLogout: true };
    } finally {
      this._isRefreshing = false;
      this._refreshSubscribers = [];
    }
  }

  get(endpoint, requiresAuth = true) {
    return this._request(endpoint, { method: 'GET' }, requiresAuth);
  }

  post(endpoint, body, requiresAuth = true) {
    return this._request(endpoint, { method: 'POST', body: JSON.stringify(body) }, requiresAuth);
  }

  put(endpoint, body, requiresAuth = true) {
    return this._request(endpoint, { method: 'PUT', body: JSON.stringify(body) }, requiresAuth);
  }

  delete(endpoint, requiresAuth = true) {
    return this._request(endpoint, { method: 'DELETE' }, requiresAuth);
  }
}

export default new ApiService();
