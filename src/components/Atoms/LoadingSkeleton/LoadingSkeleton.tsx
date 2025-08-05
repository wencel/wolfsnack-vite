import React from 'react';
import styles from './LoadingSkeleton.module.sass';

interface LoadingSkeletonProps {
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => {
  return (
    <div className={`${styles.skeleton} ${className || ''}`}>
      {/* Navbar skeleton */}
      <div className={styles.navbar}>
        <div className={styles.logo}></div>
        <div className={styles.userInfo}>
          <div className={styles.userName}></div>
          <div className={styles.logoutButton}></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className={styles.main}>
        <div className={styles.content}>
          {/* Page header skeleton */}
          <div className={styles.header}>
            <div className={styles.title}></div>
            <div className={styles.subtitle}></div>
          </div>

          {/* Customer cards skeleton */}
          <div className={styles.customerCards}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.customerCard}>
                {/* Card header with store name */}
                <div className={styles.cardHeader}>
                  <div className={styles.storeName}></div>
                </div>

                {/* Customer details */}
                <div className={styles.customerDetails}>
                  <div className={styles.detailRow}>
                    <div className={styles.icon}></div>
                    <div className={styles.detailText}></div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.icon}></div>
                    <div className={styles.detailText}></div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.icon}></div>
                    <div className={styles.detailText}></div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.icon}></div>
                    <div className={styles.detailText}></div>
                  </div>
                  <div className={styles.detailRow}>
                    <div className={styles.icon}></div>
                    <div className={styles.detailText}></div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className={styles.actionButtons}>
                  <div className={styles.actionButton}></div>
                  <div className={styles.actionButton}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top actions skeleton */}
      <div className={styles.topActions}>
        <div className={styles.actionButton}></div>
        <div className={styles.actionButton}></div>
        <div className={styles.actionButton}></div>
      </div>

      {/* Bottom navigation skeleton */}
      <div className={styles.bottomNav}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.navItem}></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
