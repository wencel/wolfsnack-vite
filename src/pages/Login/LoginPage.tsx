import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Atoms/Card';
import Input from '@/components/Atoms/Input';
import Checkbox from '@/components/Atoms/Checkbox';
import PageContainer from '@/components/Atoms/PageContainer';
import { textConstants } from '@/lib/appConstants';
import Form from '@/components/Atoms/Form';
import { useAppDispatch } from '@/store/hooks';
import { loginRequest, clearError } from '@/store/slices/authSlice';
import styles from './LoginPage.module.sass';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberUser, setRememberUser] = useState(false);

  // Clear error when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginRequest({
        credentials: { email, password, rememberUser },
        navigate,
      })
    );
  };

  const editEmail = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEmail(e.target.value);
  };

  const editPassword = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setPassword(e.target.value);
  };

  const toggleRememberMe = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setRememberUser((e.target as HTMLInputElement).checked);
  };

  return (
    <PageContainer className={styles.Login}>
      <Card
        title={textConstants.login.TITLE}
        description={textConstants.login.DESCRIPTION}
      >
        <Form
          onSubmit={submitLogin}
          buttonProps={{ buttonText: textConstants.login.BUTTON_TEXT }}
          submittingText={textConstants.login.SUBMITTING_TEXT}
        >
          <Input
            label={textConstants.login.EMAIL_LABEL}
            value={email}
            onChange={editEmail}
          />
          <Input
            label={textConstants.login.PASSWORD_LABEL}
            type='password'
            value={password}
            onChange={editPassword}
          />
          <div className={styles.checkboxContainer}>
            <Checkbox
              label={textConstants.misc.REMEMBER_ME}
              checked={rememberUser}
              onChange={toggleRememberMe}
            />
          </div>
        </Form>
      </Card>
    </PageContainer>
  );
};

export default LoginPage;
