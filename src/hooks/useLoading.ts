import { useAppSelector } from '@/store/hooks';

export const useLoading = () => {
  const { loading, submitting, fetching } = useAppSelector(
    state => state.loading
  );

  return {
    loading,
    submitting,
    fetching,
    isLoading: loading,
    isSubmitting: submitting,
    isFetching: fetching,
  };
};

export default useLoading;
