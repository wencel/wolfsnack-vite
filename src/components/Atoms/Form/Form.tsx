import React from 'react';
import classnames from 'classnames';
import styles from './Form.module.sass';
import Button from '@/components/Atoms/Button';
import useLoading from '@/hooks/useLoading';

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
  const FormClasses = classnames({
    [className as string]: !!className,
    [styles.Form]: true,
  });
  return (
    <form className={FormClasses} {...restProps}>
      {children}
      <div className={styles.buttonsContainer}>
        {secondButtonProps && (
          <Button type='button' {...omitButtonText(secondButtonProps)}>
            {secondButtonProps.buttonText}
          </Button>
        )}
        {buttonProps && (
          <Button
            type='submit'
            {...omitButtonText(buttonProps)}
            loading={isSubmitting}
            loadingText={isSubmitting ? submittingText : undefined}
          >
            {buttonProps.buttonText}
          </Button>
        )}
      </div>
    </form>
  );
};

export default Form;
