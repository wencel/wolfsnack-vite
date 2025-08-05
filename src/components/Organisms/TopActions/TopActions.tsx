import React from 'react';
import Button from '@/components/Atoms/Button/Button';
import NavigationBar from '@/components/Molecules/NavigationBar';
import styles from './TopActions.module.sass';

export interface TopActionButton {
  text: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  [key: string]: unknown;
}

export interface TopActionsProps {
  buttons?: TopActionButton[];
  className?: string;
  position?: string;
}

const TopActions: React.FC<TopActionsProps> = ({
  buttons = [],
  className,
  position,
}) => {
  const createBaseButton = (button: TopActionButton) => {
    const { href, ...buttonProps } = button;
    const props = href ? { ...buttonProps, href } : buttonProps;
    return (
      <Button
        {...props}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          if (button.onClick) button.onClick(e);
        }}
        theme='BottomNavigation'
        className={styles.item}
      >
        {button.icon}
        {button.text}
      </Button>
    );
  };

  return (
    <NavigationBar
      className={`${styles.TopActions} ${className || ''}`}
      position={position || 'top'}
    >
      {buttons?.map(button => (
        <div key={`${button.text}${button.icon}`}>
          {createBaseButton(button)}
        </div>
      ))}
    </NavigationBar>
  );
};

export default TopActions;
