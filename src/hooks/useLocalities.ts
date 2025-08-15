import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback } from 'react';
import { fetchLocalities } from '@/store/slices/localitiesSlice';

export const useLocalities = () => {
  const dispatch = useAppDispatch();
  const { localities, loading, error } = useAppSelector(
    state => state.localities
  );

  const fetchLocalitiesAction = useCallback(
    () => dispatch(fetchLocalities()),
    [dispatch]
  );

  return {
    // State
    localities,
    loading,
    error,

    // Actions
    fetchLocalities: fetchLocalitiesAction,
  };
};

export default useLocalities;
