import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Atoms/Card';
import Input from '@/components/Atoms/Input';
import PageContainer from '@/components/Atoms/PageContainer';
import { textConstants } from '@/lib/appConstants';
import Form from '@/components/Atoms/Form';
import { useAppDispatch } from '@/store/hooks';
import { signupRequest, clearError } from '@/store/slices/authSlice';
import { setSubmitError } from '@/store/slices/errorSlice';
import styles from './SignUpPage.module.sass';

const SignUpPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Clear error when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      dispatch(setSubmitError('Las contraseñas no coinciden'));
      return;
    }

    dispatch(
      signupRequest({
        credentials: { name, email, password },
        navigate,
      })
    );
  };

  const editName = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setName(e.target.value);
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

  const editConfirmPassword = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <PageContainer className={styles.SignUp}>
      <Card
        title={textConstants.signup.TITLE}
        description={textConstants.signup.DESCRIPTION}
      >
        <Form
          onSubmit={submitSignup}
          buttonProps={{ buttonText: textConstants.signup.BUTTON_TEXT }}
          submittingText={textConstants.signup.SUBMITTING_TEXT}
        >
          <Input
            label={textConstants.signup.NAME_LABEL}
            value={name}
            id="name"
            onChange={editName}
          />
          <Input
            label={textConstants.signup.EMAIL_LABEL}
            value={email}
            id="email"
            onChange={editEmail}
          />
          <Input
            label={textConstants.signup.PASSWORD_LABEL}
            type="password"
            value={password}
            id="password"
            onChange={editPassword}
          />
          <Input
            label={textConstants.signup.CONFIRM_PASSWORD_LABEL}
            type="password"
            value={confirmPassword}
            id="confirm-password"
            onChange={editConfirmPassword}
          />
        </Form>
      </Card>
    </PageContainer>
  );
};

export default SignUpPage;
