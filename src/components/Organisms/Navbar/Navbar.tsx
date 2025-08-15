import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutRequest } from '@/store/slices/authSlice';
import Button from '@/components/Atoms/Button';
import Logo from '@/components/Atoms/Logo';
import styles from './Navbar.module.sass';
import { textConstants } from '@/lib/appConstants';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutRequest()).unwrap();
      // Navigate to login page after successful logout
      navigate('/login');
    } catch {
      // Even if logout API fails, still navigate to login
      navigate('/login');
    }
  };

  return (
    <nav className={styles.Navbar}>
      <Link to='/'>
        <Logo isRound />
      </Link>
      {user && (
        <div className={styles.logout}>
          {user?.name}
          <Button
            onClick={handleLogout}
            theme='RoundWithLabel'
            type='button'
            tooltip={textConstants.navbar.LOGOUT}
          >
            <FiLogOut />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
