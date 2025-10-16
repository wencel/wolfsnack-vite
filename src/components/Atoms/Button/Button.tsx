import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './Button.module.sass';
import LoadingSpinner from '../LoadingSpinner';
import { textConstants } from '@/lib/appConstants';

interface BaseButtonProps {
  children?: React.ReactNode;
  className?: string;
  theme?: 'Primary' | 'RoundWithLabel' | 'Outline' | 'BottomNavigation';
  tooltip?: string;
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
  tooltip,
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

  const buttonContent = (
    <>
      {loading ? (
        <>
          <LoadingSpinner size="small" color="white" />
          <span className={styles.loadingText}>
            {loadingText || textConstants.misc.SUBMITTING}
          </span>
        </>
      ) : (
        children
      )}
    </>
  );

  // If href is provided, render as Link
  if (href) {
    // Filter out title if tooltip is provided to avoid duplicate tooltips
    const linkProps = tooltip
      ? {
          ...(restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>),
          title: undefined,
        }
      : (restProps as React.AnchorHTMLAttributes<HTMLAnchorElement>);

    // Create a custom onClick handler that prevents clicks when loading
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (loading) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Call the original onClick if provided and not loading
      if (linkProps.onClick) {
        linkProps.onClick(e);
      }
    };

    // Remove onClick from linkProps to avoid conflicts with our custom handler
    const { onClick, ...linkPropsWithoutOnClick } = linkProps;

    return (
      <Tooltip.Provider delayDuration={0}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className={wrapperClasses}>
              <Link
                to={href}
                className={buttonClasses}
                onClick={handleLinkClick}
                {...linkPropsWithoutOnClick}
              >
                {buttonContent}
              </Link>
            </div>
          </Tooltip.Trigger>
          {tooltip && (
            <Tooltip.Portal>
              <Tooltip.Content
                className={styles.tooltip}
                sideOffset={5}
                side="top"
              >
                {tooltip}
                <Tooltip.Arrow className={styles.tooltipArrow} />
              </Tooltip.Content>
            </Tooltip.Portal>
          )}
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  // Otherwise render as button
  // Filter out title if tooltip is provided to avoid duplicate tooltips
  const buttonProps = tooltip
    ? {
        ...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>),
        title: undefined,
      }
    : (restProps as React.ButtonHTMLAttributes<HTMLButtonElement>);

  // Get the aria-label for the button based on the loading, tooltip, and children props
  const getAriaLabel = () => {
    if (loading) {
      return loadingText || textConstants.misc.LOADING;
    }
    if (tooltip) {
      return tooltip;
    }
    if (children) {
      // Extract only text content from children, ignoring React elements
      const extractText = (node: React.ReactNode): string => {
        if (
          typeof node === 'string' ||
          typeof node === 'number' ||
          typeof node === 'boolean'
        ) {
          return String(node);
        }
        if (Array.isArray(node)) {
          return node.map(extractText).join('');
        }
        if (
          React.isValidElement(node) &&
          node.props &&
          typeof node.props === 'object' &&
          'children' in node.props
        ) {
          return extractText(node.props.children as React.ReactNode);
        }
        return '';
      };
      const textContent = extractText(children);
      return textContent || textConstants.misc.BUTTON_TEXT;
    }
    return textConstants.misc.BUTTON_TEXT;
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={wrapperClasses}>
            <button
              className={buttonClasses}
              disabled={
                loading ||
                (buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)
                  .disabled
              }
              aria-label={getAriaLabel()}
              {...buttonProps}
            >
              {buttonContent}
            </button>
          </div>
        </Tooltip.Trigger>
        {tooltip && (
          <Tooltip.Portal>
            <Tooltip.Content
              className={styles.tooltip}
              sideOffset={5}
              side="top"
            >
              {tooltip}
              <Tooltip.Arrow className={styles.tooltipArrow} />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default Button;
