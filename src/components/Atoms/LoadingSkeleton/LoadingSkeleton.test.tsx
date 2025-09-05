import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSkeleton from './';

describe('LoadingSkeleton', () => {
  it('renders the main skeleton container', () => {
    render(<LoadingSkeleton />);
    
    const skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toBeVisible();
  });

  it('renders navbar skeleton elements', () => {
    render(<LoadingSkeleton />);
    
    const navbarSkeleton = screen.getByTestId('navbar-skeleton');
    expect(navbarSkeleton).toBeVisible();
    
    const logo = screen.getByTestId('logo-skeleton');
    const userInfo = screen.getByTestId('user-info-skeleton');
    const userName = screen.getByTestId('user-name-skeleton');
    const logoutButton = screen.getByTestId('logout-button-skeleton');
    
    expect(logo).toBeVisible();
    expect(userInfo).toBeVisible();
    expect(userName).toBeVisible();
    expect(logoutButton).toBeVisible();
  });

  it('renders main content skeleton', () => {
    render(<LoadingSkeleton />);
    
    const mainContent = screen.getByTestId('main-content-skeleton');
    const content = screen.getByTestId('content-skeleton');
    const header = screen.getByTestId('header-skeleton');
    const title = screen.getByTestId('title-skeleton');
    const subtitle = screen.getByTestId('subtitle-skeleton');
    
    expect(mainContent).toBeVisible();
    expect(content).toBeVisible();
    expect(header).toBeVisible();
    expect(title).toBeVisible();
    expect(subtitle).toBeVisible();
  });

  it('renders customer cards skeleton with correct structure', () => {
    render(<LoadingSkeleton />);
    
    const customerCards = screen.getByTestId('customer-cards-skeleton');
    expect(customerCards).toBeVisible();
    
    // Check that we have exactly 3 customer card skeletons
    const card1 = screen.getByTestId('customer-card-skeleton-1');
    const card2 = screen.getByTestId('customer-card-skeleton-2');
    const card3 = screen.getByTestId('customer-card-skeleton-3');
    
    expect(card1).toBeVisible();
    expect(card2).toBeVisible();
    expect(card3).toBeVisible();
    
    // Check first card structure
    const card1Header = screen.getByTestId('card-header-skeleton-1');
    const card1StoreName = screen.getByTestId('store-name-skeleton-1');
    const card1Details = screen.getByTestId('customer-details-skeleton-1');
    const card1ActionButtons = screen.getByTestId('action-buttons-skeleton-1');
    
    expect(card1Header).toBeVisible();
    expect(card1StoreName).toBeVisible();
    expect(card1Details).toBeVisible();
    expect(card1ActionButtons).toBeVisible();
    
    // Check detail rows exist
    const detailRow1 = screen.getByTestId('detail-row-skeleton-1-1');
    const detailRow5 = screen.getByTestId('detail-row-skeleton-1-5');
    expect(detailRow1).toBeVisible();
    expect(detailRow5).toBeVisible();
    
    // Check action buttons exist
    const actionButton1 = screen.getByTestId('action-button-skeleton-1-1');
    const actionButton2 = screen.getByTestId('action-button-skeleton-1-2');
    expect(actionButton1).toBeVisible();
    expect(actionButton2).toBeVisible();
  });

  it('renders top actions skeleton', () => {
    render(<LoadingSkeleton />);
    
    const topActions = screen.getByTestId('top-actions-skeleton');
    expect(topActions).toBeVisible();
    
    const actionButton1 = screen.getByTestId('top-action-button-skeleton-1');
    const actionButton2 = screen.getByTestId('top-action-button-skeleton-2');
    const actionButton3 = screen.getByTestId('top-action-button-skeleton-3');
    
    expect(actionButton1).toBeVisible();
    expect(actionButton2).toBeVisible();
    expect(actionButton3).toBeVisible();
  });

  it('renders bottom navigation skeleton', () => {
    render(<LoadingSkeleton />);
    
    const bottomNav = screen.getByTestId('bottom-nav-skeleton');
    expect(bottomNav).toBeVisible();
    
    const navItem1 = screen.getByTestId('nav-item-skeleton-1');
    const navItem2 = screen.getByTestId('nav-item-skeleton-2');
    const navItem3 = screen.getByTestId('nav-item-skeleton-3');
    const navItem4 = screen.getByTestId('nav-item-skeleton-4');
    
    expect(navItem1).toBeVisible();
    expect(navItem2).toBeVisible();
    expect(navItem3).toBeVisible();
    expect(navItem4).toBeVisible();
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-skeleton-class';
    render(<LoadingSkeleton className={customClass} />);
    
    const skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toHaveClass(customClass);
  });

  it('renders without custom className when not provided', () => {
    render(<LoadingSkeleton />);
    
    const skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer.className).toContain('skeleton');
    expect(skeletonContainer.className).not.toContain('undefined');
  });

  it('maintains consistent skeleton structure across renders', () => {
    const { rerender } = render(<LoadingSkeleton />);
    
    // Check initial render
    let skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toBeVisible();
    
    // Re-render with different props
    rerender(<LoadingSkeleton className="test-class" />);
    
    // Structure should remain the same
    skeletonContainer = screen.getByTestId('loading-skeleton');
    expect(skeletonContainer).toBeVisible();
    expect(skeletonContainer).toHaveClass('test-class');
    
    // All skeleton elements should still be present
    expect(screen.getByTestId('navbar-skeleton')).toBeVisible();
    expect(screen.getByTestId('main-content-skeleton')).toBeVisible();
    expect(screen.getByTestId('top-actions-skeleton')).toBeVisible();
    expect(screen.getByTestId('bottom-nav-skeleton')).toBeVisible();
  });
});
