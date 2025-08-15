import { useAppSelector } from '@/store/hooks';

export const useError = () => {
  const { submitError, generalError } = useAppSelector(state => state.error);

  return {
    submitError,
    generalError,
  };
};
