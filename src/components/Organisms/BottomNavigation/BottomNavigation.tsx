import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaMoneyBillWave, FaDog } from 'react-icons/fa';
import { ImTruck } from 'react-icons/im';
import { MdPerson } from 'react-icons/md';
import { textConstants } from '@/lib/appConstants';
import Button from '@/components/Atoms/Button/Button';
import NavigationBar from '@/components/Molecules/NavigationBar';
import styles from './BottomNavigation.module.sass';

const BottomNavigation: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <NavigationBar className={styles.BottomNavigation}>
        <Button
          href="/customers"
          theme="BottomNavigation"
          isActive={pathname === '/customers'}
        >
          <MdPerson />
          {textConstants.navbar.CUSTOMERS}
        </Button>
        <Button
          href="/products"
          theme="BottomNavigation"
          isActive={pathname === '/products'}
        >
          <FaDog />
          {textConstants.navbar.PRODUCTS}
        </Button>
        <Button
          href="/sales"
          theme="BottomNavigation"
          isActive={pathname === '/sales'}
        >
          <FaMoneyBillWave />
          {textConstants.navbar.SALES}
        </Button>
        <Button
          href="/orders"
          theme="BottomNavigation"
          isActive={pathname === '/orders'}
        >
          <ImTruck />
          {textConstants.navbar.ORDERS}
        </Button>
      </NavigationBar>
    </div>
  );
};

export default BottomNavigation;
