import React from 'react';
import { useAppSelector } from '@/store/hooks';
import Navbar from '@/components/Organisms/Navbar';
import BottomNavigation from '@/components/Organisms/BottomNavigation';
import Loading from '@/components/Atoms/Loading';
import useLoading from '@/hooks/useLoading';
import styles from './Layout.module.sass';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useLoading();
  const { isAuthenticated } = useAppSelector(state => state.auth);

  return (
    <div className={styles.Layout}>
      {loading && <Loading />}
      <Navbar />
      <main className={styles.main}>{children}</main>
      {isAuthenticated && <BottomNavigation />}
    </div>
  );
};

export default Layout;
