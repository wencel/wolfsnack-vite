import React from 'react';
import styles from './LoadingSkeleton.module.sass';

interface LoadingSkeletonProps {
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className }) => {
  return (
    <div
      className={`${styles.skeleton} ${className || ''}`}
      data-testid="loading-skeleton"
    >
      {/* Navbar skeleton */}
      <div className={styles.navbar} data-testid="navbar-skeleton">
        <div className={styles.logo} data-testid="logo-skeleton"></div>
        <div className={styles.userInfo} data-testid="user-info-skeleton">
          <div
            className={styles.userName}
            data-testid="user-name-skeleton"
          ></div>
          <div
            className={styles.logoutButton}
            data-testid="logout-button-skeleton"
          ></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className={styles.main} data-testid="main-content-skeleton">
        <div className={styles.content} data-testid="content-skeleton">
          {/* Page header skeleton */}
          <div className={styles.header} data-testid="header-skeleton">
            <div className={styles.title} data-testid="title-skeleton"></div>
            <div
              className={styles.subtitle}
              data-testid="subtitle-skeleton"
            ></div>
          </div>

          {/* Customer cards skeleton */}
          <div
            className={styles.customerCards}
            data-testid="customer-cards-skeleton"
          >
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={styles.customerCard}
                data-testid={`customer-card-skeleton-${i}`}
              >
                {/* Card header with store name */}
                <div
                  className={styles.cardHeader}
                  data-testid={`card-header-skeleton-${i}`}
                >
                  <div
                    className={styles.storeName}
                    data-testid={`store-name-skeleton-${i}`}
                  ></div>
                </div>

                {/* Customer details */}
                <div
                  className={styles.customerDetails}
                  data-testid={`customer-details-skeleton-${i}`}
                >
                  <div
                    className={styles.detailRow}
                    data-testid={`detail-row-skeleton-${i}-1`}
                  >
                    <div
                      className={styles.icon}
                      data-testid={`icon-skeleton-${i}-1`}
                    ></div>
                    <div
                      className={styles.detailText}
                      data-testid={`detail-text-skeleton-${i}-1`}
                    ></div>
                  </div>
                  <div
                    className={styles.detailRow}
                    data-testid={`detail-row-skeleton-${i}-2`}
                  >
                    <div
                      className={styles.icon}
                      data-testid={`icon-skeleton-${i}-2`}
                    ></div>
                    <div
                      className={styles.detailText}
                      data-testid={`detail-text-skeleton-${i}-2`}
                    ></div>
                  </div>
                  <div
                    className={styles.detailRow}
                    data-testid={`detail-row-skeleton-${i}-3`}
                  >
                    <div
                      className={styles.icon}
                      data-testid={`icon-skeleton-${i}-3`}
                    ></div>
                    <div
                      className={styles.detailText}
                      data-testid={`detail-text-skeleton-${i}-3`}
                    ></div>
                  </div>
                  <div
                    className={styles.detailRow}
                    data-testid={`detail-row-skeleton-${i}-4`}
                  >
                    <div
                      className={styles.icon}
                      data-testid={`icon-skeleton-${i}-4`}
                    ></div>
                    <div
                      className={styles.detailText}
                      data-testid={`detail-text-skeleton-${i}-4`}
                    ></div>
                  </div>
                  <div
                    className={styles.detailRow}
                    data-testid={`detail-row-skeleton-${i}-5`}
                  >
                    <div
                      className={styles.icon}
                      data-testid={`icon-skeleton-${i}-5`}
                    ></div>
                    <div
                      className={styles.detailText}
                      data-testid={`detail-text-skeleton-${i}-5`}
                    ></div>
                  </div>
                </div>

                {/* Action buttons */}
                <div
                  className={styles.actionButtons}
                  data-testid={`action-buttons-skeleton-${i}`}
                >
                  <div
                    className={styles.actionButton}
                    data-testid={`action-button-skeleton-${i}-1`}
                  ></div>
                  <div
                    className={styles.actionButton}
                    data-testid={`action-button-skeleton-${i}-2`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top actions skeleton */}
      <div className={styles.topActions} data-testid="top-actions-skeleton">
        <div
          className={styles.actionButton}
          data-testid="top-action-button-skeleton-1"
        ></div>
        <div
          className={styles.actionButton}
          data-testid="top-action-button-skeleton-2"
        ></div>
        <div
          className={styles.actionButton}
          data-testid="top-action-button-skeleton-3"
        ></div>
      </div>

      {/* Bottom navigation skeleton */}
      <div className={styles.bottomNav} data-testid="bottom-nav-skeleton">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={styles.navItem}
            data-testid={`nav-item-skeleton-${i}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
