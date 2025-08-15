import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import AuthProvider from '@/components/Providers/AuthProvider';
import ToastProvider from '@/components/Providers/ToastProvider';
import Layout from '@/components/Layout';
import { ProtectedRoute, PublicRoute } from '@/components/Guards';
import Login from '@/pages/Login';
import Customers from '@/pages/CustomersPage/CustomersPage';
import Customer from '@/pages/Customer/CustomerPage';
import AddEditCustomer from '@/pages/AddEditCustomer';
import NotFound from '@/pages/NotFound';
import usePageTitle from '@/hooks/usePageTitle';
import './App.css';
import '@/styles/styles.global.sass';

function AppContent() {
  usePageTitle();

  return (
    <div className='App'>
      <Layout>
        <Routes>
          {/* Public routes - only accessible when NOT authenticated */}
          <Route
            path='/login'
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected routes - only accessible when authenticated */}
          <Route
            path='/customers'
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path='/customers/new'
            element={
              <ProtectedRoute>
                <AddEditCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path='/customers/:id/edit'
            element={
              <ProtectedRoute>
                <AddEditCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path='/customers/:id'
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />

          {/* Root route - redirect based on auth status */}
          <Route path='/' element={<Navigate to='/customers' replace />} />

          {/* 404 page for unmatched routes */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Layout>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
