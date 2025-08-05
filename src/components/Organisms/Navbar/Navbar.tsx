import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutRequest } from '@/store/slices/authSlice';
import Button from '@/components/Atoms/Button';
import Logo from '@/components/Atoms/Logo';
import styles from './Navbar.module.sass';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <nav className={styles.Navbar}>
      <Link to='/'>
        <Logo isRound />
      </Link>
      {user && (
        <div className={styles.logout}>
          {user?.name}
          <Button onClick={handleLogout} theme='RoundWithLabel' type='button'>
            <FiLogOut />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
