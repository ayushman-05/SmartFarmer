import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/auth.service';
import apiService from '../services/api.service';
import { STORAGE_KEYS } from '../constants';

// ── State & Reducer ──────────────────────────────────────────────────────────

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // true on app start while checking stored session
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // On app mount: restore session if tokens exist
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        // Fetch fresh profile from API to validate token
        const response = await apiService.get('/users/me');
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      // Token invalid or expired — clear and go to login
      await authService._clearSession();
      dispatch({ type: 'LOGOUT' });
    }
  };

  const register = useCallback(async (userData) => {
    return authService.register(userData);
  }, []);

  const verifyRegistration = useCallback(async (mobile, otp) => {
    const response = await authService.verifyRegistration(mobile, otp);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
    return response;
  }, []);

  const sendLoginOTP = useCallback(async (mobile) => {
    return authService.sendLoginOTP(mobile);
  }, []);

  const verifyLogin = useCallback(async (mobile, otp) => {
    const response = await authService.verifyLogin(mobile, otp);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
    return response;
  }, []);

  const updateUser = useCallback((updatedFields) => {
    dispatch({ type: 'UPDATE_USER', payload: updatedFields });
    // Also sync to AsyncStorage
    AsyncStorage.getItem(STORAGE_KEYS.USER).then((stored) => {
      if (stored) {
        const user = { ...JSON.parse(stored), ...updatedFields };
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
    // Expo Router's RouteGuard in _layout.js will redirect to /(auth)/login
    // automatically when isAuthenticated becomes false
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        verifyRegistration,
        sendLoginOTP,
        verifyLogin,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
