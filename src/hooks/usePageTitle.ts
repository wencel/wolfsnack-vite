import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { textConstants } from '@/lib/appConstants';

const getPageTitle = (pathname: string): string => {
  const baseTitle = 'Wolf Snacks';

  // Define title mappings for different routes using Spanish constants
  const titleMap: Record<string, string> = {
    '/': textConstants.pageTitles.HOME,
    '/login': textConstants.pageTitles.LOGIN,
    '/customers': textConstants.pageTitles.CUSTOMERS,
    '/customers/new': textConstants.pageTitles.ADD_CUSTOMER,
    '/products': textConstants.pageTitles.PRODUCTS,
    '/products/new': textConstants.pageTitles.ADD_PRODUCT,
    '/orders': textConstants.pageTitles.ORDERS,
    '/sales': textConstants.pageTitles.SALES,
  };

  // Check for dynamic routes (like /customers/:id)
  if (pathname.startsWith('/customers/') && pathname !== '/customers/new') {
    const parts = pathname.split('/');
    if (parts.length === 3 && parts[2] !== 'new') {
      // Check if it's an edit route
      if (pathname.includes('/edit')) {
        return `${textConstants.pageTitles.EDIT_CUSTOMER} - ${baseTitle}`;
      }
      // It's a view customer route
      return `${textConstants.pageTitles.CUSTOMER_DETAILS} - ${baseTitle}`;
    }
    // Handle nested routes like /customers/:id/edit
    if (parts.length === 4 && parts[3] === 'edit') {
      return `${textConstants.pageTitles.EDIT_CUSTOMER} - ${baseTitle}`;
    }
  }

  // Check for dynamic product routes (like /products/:id)
  if (pathname.startsWith('/products/') && pathname !== '/products/new') {
    const parts = pathname.split('/');
    if (parts.length === 3 && parts[2] !== 'new') {
      // Check if it's an edit route
      if (pathname.includes('/edit')) {
        return `${textConstants.pageTitles.EDIT_PRODUCT} - ${baseTitle}`;
      }
      // It's a view product route
      return `${textConstants.pageTitles.PRODUCT_DETAILS} - ${baseTitle}`;
    }
    // Handle nested routes like /products/:id/edit
    if (parts.length === 4 && parts[3] === 'edit') {
      return `${textConstants.pageTitles.EDIT_PRODUCT} - ${baseTitle}`;
    }
  }

  // Get title from map or use pathname
  const routeTitle =
    titleMap[pathname] || pathname.slice(1).replace(/\//g, ' - ');

  return routeTitle ? `${routeTitle} - ${baseTitle}` : baseTitle;
};

export const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const title = getPageTitle(location.pathname);
    document.title = title;
  }, [location.pathname]);
};

export default usePageTitle;
