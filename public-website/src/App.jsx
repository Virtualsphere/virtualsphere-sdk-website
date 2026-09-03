import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ReaderDetailPage from './pages/ReaderDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/readers/:id" element={<ReaderDetailPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
