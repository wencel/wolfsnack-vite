import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';
import LoadingSkeleton from '@/components/Atoms/LoadingSkeleton';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Only check auth once on app initialization
    if (!initialized) {
      dispatch(checkAuth());
    }
  }, [dispatch, initialized]);

  // Show loading skeleton during initial auth check
  if (!initialized) {
    return <LoadingSkeleton />;
  }

  return <>{children}</>;
};

export default AuthProvider;
