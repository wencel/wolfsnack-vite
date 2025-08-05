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
import CustomersPage from '@/pages/Customers/CustomersPage';
import NotFound from '@/pages/NotFound';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AuthProvider>
          <Router>
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
                        <CustomersPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Root route - redirect based on auth status */}
                  <Route
                    path='/'
                    element={<Navigate to='/customers' replace />}
                  />

                  {/* 404 page for unmatched routes */}
                  <Route path='*' element={<NotFound />} />
                </Routes>
              </Layout>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </Provider>
  );
}

export default App;
