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
import PublicRoute from '@/components/Guards/PublicRoute';
import ProtectedRoute from '@/components/Guards/ProtectedRoute';
import Login from '@/pages/Login';
import Customers from '@/pages/Customers/CustomersPage';
import Customer from '@/pages/Customer/CustomerPage';
import AddEditCustomer from '@/pages/AddEditCustomer';
import Products from '@/pages/Products';
import Product from '@/pages/Product';
import AddEditProduct from '@/pages/AddEditProduct';
import Sales from '@/pages/Sales';
import Sale from '@/pages/Sale';
import AddEditSale from '@/pages/AddEditSale';
import Orders from '@/pages/Orders';
import Order from '@/pages/Order';
import AddEditOrder from '@/pages/AddEditOrder';
import NotFound from '@/pages/NotFound';
import usePageTitle from '@/hooks/usePageTitle';
import './App.css';
import '@/styles/styles.global.sass';
import ActivationPage from './pages/Activation';
import SignUpPage from './pages/SignUp';

function AppContent() {
  usePageTitle();

  return (
    <div className="App">
      <Layout>
        <Routes>
          {/* Public routes - only accessible when NOT authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/activate/:token"
            element={
              <PublicRoute>
                <ActivationPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            }
          />

          {/* Protected routes - only accessible when authenticated */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <ProtectedRoute>
                <AddEditCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id/edit"
            element={
              <ProtectedRoute>
                <AddEditCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />

          {/* Products routes */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <AddEditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <AddEditProduct />
              </ProtectedRoute>
            }
          />

          {/* Sales routes */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <Sales />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/new"
            element={
              <ProtectedRoute>
                <AddEditSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/:id/edit"
            element={
              <ProtectedRoute>
                <AddEditSale />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales/:id"
            element={
              <ProtectedRoute>
                <Sale />
              </ProtectedRoute>
            }
          />

          {/* Orders routes */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <ProtectedRoute>
                <AddEditOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id/edit"
            element={
              <ProtectedRoute>
                <AddEditOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />

          {/* Root route - redirect based on auth status */}
          <Route path="/" element={<Navigate to="/customers" replace />} />

          {/* 404 page for unmatched routes */}
          <Route path="*" element={<NotFound />} />
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
