import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useCallback, useEffect } from 'react';
import { fetchPresentations } from '@/store/slices/presentationsSlice';

export const usePresentations = () => {
  const dispatch = useAppDispatch();
  const { presentations, loading, error } = useAppSelector(
    state => state.presentations
  );

  const fetchPresentationsAction = useCallback(
    () => dispatch(fetchPresentations()),
    [dispatch]
  );

  // Auto-fetch presentations on mount
  useEffect(() => {
    if (presentations.length === 0 && !loading) {
      fetchPresentationsAction();
    }
  }, [fetchPresentationsAction, presentations.length, loading]);

  return {
    presentations,
    loading,
    error,
    fetchPresentations: fetchPresentationsAction,
  };
};

export default usePresentations;
