import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '@/components/Atoms/Card';
import PageContainer from '@/components/Atoms/PageContainer';
import { textConstants } from '@/lib/appConstants';
import { useAppDispatch } from '@/store/hooks';
import { clearError, activationRequest } from '@/store/slices/authSlice';
import styles from './ActivationPage.module.sass';
import Button from '@/components/Atoms/Button';

const ActivationPage = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Clear error when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const requestActivation = () => {
    dispatch(activationRequest({ token: token!, navigate }));
  };

  return (
    <PageContainer className={styles.Activate}>
      <Card
        title={textConstants.activation.TITLE}
        description={textConstants.activation.DESCRIPTION}
      >
        <Button
          className={styles.activateButton}
          theme="Primary"
          onClick={requestActivation}
        >
          {textConstants.activation.BUTTON_TEXT}
        </Button>
      </Card>
    </PageContainer>
  );
};

export default ActivationPage;
