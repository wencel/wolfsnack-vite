import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/customers',
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Redirect authenticated users to the specified route
  if (isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Render children if not authenticated
  return <>{children}</>;
};

export default PublicRoute;
