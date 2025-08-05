import React, { useId } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import styles from './Button.module.sass';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface BaseButtonProps {
  children?: React.ReactNode;
  className?: string;
  theme?: string;
  label?: string;
  isActive?: boolean;
  loading?: boolean;
  loadingText?: string;
}

interface ButtonButtonProps
  extends BaseButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

interface ButtonLinkProps
  extends BaseButtonProps,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

type ButtonProps = ButtonButtonProps | ButtonLinkProps;

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  theme,
  label,
  isActive,
  loading = false,
  loadingText,
  href,
  ...restProps
}) => {
  const wrapperClasses = classnames({
    [className as string]: !!className,
    [styles.Button]: true,
  });

  const buttonClasses = classnames({
    [styles[theme as keyof typeof styles]]: true,
    [styles.active]: isActive,
    [styles.loading]: loading,
  });

  const id = useId();

  // If href is provided, render as Link
  if (href) {
    return (
      <div className={wrapperClasses}>
        {label && <label htmlFor={id}>{label}</label>}
        <Link
          id={id}
          to={href}
          className={buttonClasses}
          {...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      </div>
    );
  }

  // Otherwise render as button
  return (
    <div className={wrapperClasses}>
      {label && <label htmlFor={id}>{label}</label>}
      <button
        id={id}
        className={buttonClasses}
        disabled={
          loading ||
          (restProps as React.ButtonHTMLAttributes<HTMLButtonElement>).disabled
        }
        {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {loading ? (
          <>
            <LoadingSpinner size='small' color='white' />
            {loadingText && (
              <span className={styles.loadingText}>{loadingText}</span>
            )}
          </>
        ) : (
          children
        )}
      </button>
    </div>
  );
};

export default Button;
