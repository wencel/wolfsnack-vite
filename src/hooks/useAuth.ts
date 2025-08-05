import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  logoutRequest,
  syncTokenFromStorage,
  forceLogout,
} from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, error, initialized } = useAppSelector(
    state => state.auth
  );

  const { loading, submitting } = useAppSelector(state => state.loading);

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    submitting,
    error,
    initialized,

    // Actions
    logout: () => dispatch(logoutRequest()),
    forceLogout: () => dispatch(forceLogout()),
    syncTokenFromStorage: () => dispatch(syncTokenFromStorage()),

    // Helpers
    hasToken: !!token,
    isLoggedIn: isAuthenticated && !!token,
  };
};

export default useAuth;
