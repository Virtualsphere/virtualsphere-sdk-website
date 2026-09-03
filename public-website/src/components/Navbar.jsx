import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'HOME', to: '/' },
  { label: 'ABOUT', to: '/about' },
  { label: 'RFID', href: 'https://virtualspheretechnologies.in/rfid' },
  { label: 'STORE', href: 'https://indiarfidshop.com/' },
  { label: 'PORTFOLIO', href: 'https://virtualspheretechnologies.in/portfolio' },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(link) {
    if (link.to === '/') return location.pathname === '/' || location.pathname.startsWith('/readers/');
    if (link.to) return location.pathname.startsWith(link.to);
    return false;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src="/logo-white.png" alt="Virtualsphere Technologies" className="h-7 w-auto sm:h-8" />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold sm:flex">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={isActive(link) ? 'text-[#4b9bff]' : 'text-white transition hover:text-[#4b9bff]'}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-white transition hover:text-[#4b9bff]"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden sm:block">
          <a
            href="https://virtualspheretechnologies.in/contact"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-[#1A73E8] px-6 py-2 text-sm font-bold text-white transition hover:bg-[#1560c9]"
          >
            CONTACT US
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 sm:hidden"
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
      </div>

      {menuOpen && (
        <nav className="border-t border-white/10 bg-black px-4 py-2 sm:hidden">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block rounded-lg px-2 py-2 text-sm font-semibold ${
                  isActive(link) ? 'text-[#4b9bff]' : 'text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-2 py-2 text-sm font-semibold text-white hover:bg-white/5"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="https://virtualspheretechnologies.in/contact"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-md bg-[#1A73E8] px-4 py-2 text-center text-sm font-bold text-white hover:bg-[#1560c9]"
          >
            CONTACT US
          </a>
        </nav>
      )}
    </header>
  );
}
