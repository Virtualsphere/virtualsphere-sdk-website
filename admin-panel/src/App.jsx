import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ReaderFormPage from './pages/ReaderFormPage.jsx';
import VideosPage from './pages/VideosPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/readers/new"
        element={
          <ProtectedRoute>
            <ReaderFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/readers/:id/edit"
        element={
          <ProtectedRoute>
            <ReaderFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <VideosPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
