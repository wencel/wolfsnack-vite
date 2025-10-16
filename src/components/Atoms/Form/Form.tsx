import React from 'react';
import classnames from 'classnames';
import styles from './Form.module.sass';
import Button from '@/components/Atoms/Button';
import useLoading from '@/hooks/useLoading';
import { useError } from '@/hooks/useError';
import { textConstants } from '@/lib/appConstants';

// Helper to remove buttonText from props before passing to Button
function omitButtonText(props: ButtonProps) {
  const rest = { ...props };
  delete rest.buttonText;
  return rest;
}

interface ButtonProps {
  buttonText?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  [key: string]: unknown;
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
  className?: string;
  buttonProps?: ButtonProps;
  secondButtonProps?: ButtonProps;
  submittingText?: string;
}

const Form: React.FC<FormProps> = ({
  children,
  className,
  buttonProps,
  secondButtonProps,
  submittingText,
  ...restProps
}) => {
  const { isSubmitting } = useLoading();
  const { submitError } = useError();

  const FormClasses = classnames({
    [className as string]: !!className,
    [styles.Form]: true,
  });

  return (
    <form className={FormClasses} role="form" {...restProps}>
      {children}

      {/* Display submit error if present */}
      {submitError && <div className={styles.errorMessage}>{submitError}</div>}

      <div className={styles.buttonsContainer}>
        {secondButtonProps && (
          <Button type="button" {...omitButtonText(secondButtonProps)}>
            {secondButtonProps.buttonText}
          </Button>
        )}
        <Button
          type="submit"
          {...(buttonProps && omitButtonText(buttonProps))}
          loading={isSubmitting}
          loadingText={submittingText || textConstants.misc.SUBMITTING}
        >
          {buttonProps ? buttonProps.buttonText : textConstants.misc.SUBMIT}
        </Button>
      </div>
    </form>
  );
};

export default Form;
