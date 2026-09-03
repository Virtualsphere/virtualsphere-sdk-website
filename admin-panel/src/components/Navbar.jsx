import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinks = [
  { label: 'Readers', to: '/' },
  { label: 'Videos', to: '/videos' },
];

export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src="/logo.png" alt="Virtualsphere Technologies" className="h-7 w-auto sm:h-8" />
        </Link>

        {admin && (
          <>
            <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    location.pathname === link.to
                      ? 'text-indigo-600'
                      : 'text-slate-600 transition hover:text-slate-900'
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-4 text-sm sm:flex">
              <span className="text-slate-500">Signed in as {admin.username}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-50"
              >
                Log out
              </button>
            </div>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 sm:hidden"
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>

      {admin && menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
          <nav className="mb-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-2 py-2 text-sm font-medium ${
                  location.pathname === link.to ? 'text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mb-3 text-sm text-slate-500">Signed in as {admin.username}</p>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
