import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './api.service';
import { STORAGE_KEYS } from '../constants';

class AuthService {
  /**
   * Register new farmer
   */
  async register(userData) {
    return apiService.post('/auth/register', userData, false);
  }

  /**
   * Verify registration OTP and get tokens
   */
  async verifyRegistration(mobile, otp) {
    const response = await apiService.post('/auth/verify-registration', { mobile, otp }, false);
    await this._storeSession(response.data);
    return response;
  }

  /**
   * Send login OTP
   */
  async sendLoginOTP(mobile) {
    return apiService.post('/auth/send-otp', { mobile }, false);
  }

  /**
   * Verify login OTP and get tokens
   */
  async verifyLogin(mobile, otp) {
    const response = await apiService.post('/auth/verify-login', { mobile, otp }, false);
    await this._storeSession(response.data);
    return response;
  }

  /**
   * Logout current device
   */
  async logout() {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      await apiService.post('/auth/logout', { refreshToken });
    } catch (_) {
      // Proceed with local logout even if API fails
    } finally {
      await this._clearSession();
    }
  }

  /**
   * Logout all devices
   */
  async logoutAll() {
    try {
      await apiService.post('/auth/logout-all', {});
    } catch (_) {
    } finally {
      await this._clearSession();
    }
  }

  /**
   * Check if user is authenticated (has valid stored tokens)
   */
  async isAuthenticated() {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return !!(token && user);
  }

  /**
   * Get stored user data
   */
  async getStoredUser() {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Save tokens and user to storage
   */
  async _storeSession({ user, accessToken, refreshToken }) {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
      [STORAGE_KEYS.USER, JSON.stringify(user)],
    ]);
  }

  /**
   * Clear all session data
   */
  async _clearSession() {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  }
}

export default new AuthService();
