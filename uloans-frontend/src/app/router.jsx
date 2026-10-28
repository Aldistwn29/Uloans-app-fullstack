// src/app/router.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/Resgistrasi';
import DashboardPage from '../features/loans/pages/DashboardPage';
import LoanApplicationPage from '../features/loans/pages/LoanApplicationPage';
import LoanDetailPage from '../features/loans/pages/LoanDetailPage';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ke login */}
        <Route path="/"          element={<Navigate to="/login" replace />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
          }   
          />
        <Route
          path="/loans/apply"
          element={
            <ProtectedRoute>
              <LoanApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/loans/:loanId"
          element={
            <ProtectedRoute>
              <LoanDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
