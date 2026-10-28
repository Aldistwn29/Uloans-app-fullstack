// src/components/ProtectedRoute.jsx
// Redirect ke /login jika tidak ada token
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../features/auth/auth.service';

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
