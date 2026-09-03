import { Link } from 'react-router-dom';

const quickLinks = [
  { label: 'Readers', to: '/' },
  { label: 'Videos', to: '/#videos' },
  { label: 'About', to: '/about' },
];

const moreLinks = [
  { label: 'Web & App Development', href: 'https://virtualspheretechnologies.in/web-app-development' },
  { label: 'RFID Store', href: 'https://indiarfidshop.com' },
  { label: 'Portfolio', href: 'https://virtualspheretechnologies.in/portfolio' },
  { label: 'Contact', href: 'https://virtualspheretechnologies.in/contact' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/virtualsphereindia/', icon: InstagramIcon },
  { label: 'X', href: 'https://x.com/Virtualsphere_', icon: XIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/virtualsphere/', icon: LinkedInIcon },
];

export default function Footer() {
  return (
    <footer className="bg-[#1e1e26] text-sm text-white">
      <div className="grid grid-cols-1 gap-10 bg-[#12121A] px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-6 md:px-10">
        <div className="md:col-span-2">
          <img src="/logo-white.png" alt="Virtualsphere Technologies" className="h-8 w-auto" />
          <p className="mt-4 leading-relaxed text-gray-300">
            Registered Office: Naka No 6,
            <br />
            Rahamagunj, Darbhanga-846004,
            <br />
            Bihar, India.
          </p>
          <p className="mt-2 text-gray-400">CIN NO. U62011BR2023PTC065082</p>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">Quick Links</h3>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-[#5b9df9] hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">More</h3>
          <ul className="space-y-2">
            {moreLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="text-[#5b9df9] hover:underline">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="mb-4 text-base font-semibold">Get in Touch</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              318-D, Nodia Sector 10, Block D
              <br />
              Noida Sector 10, 201301
            </li>
            <li>
              <a href="tel:+917050506400" className="hover:text-white">
                +91 7050506400
              </a>
            </li>
            <li>
              <a href="tel:+918810314540" className="hover:text-white">
                +91 8810314540
              </a>
            </li>
            <li>
              <a href="mailto:info@virtualspheretechnologies.in" className="hover:text-white">
                info@virtualspheretechnologies.in
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#0D0D16] px-4 py-8 sm:px-6 md:px-10">
        <div className="flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-6 md:flex-row">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <img src="/logo-white.png" alt="Virtualsphere Technologies" className="h-7 w-auto" />
            <p className="text-gray-300">
              Explore our RFID readers, watch product videos,
              <br className="hidden sm:block" />
              and download SDKs &amp; demo software.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/10 hover:text-[#4b9bff]"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Virtualsphere Technologies Pvt Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.24.61-.52 1.05-.98 1.51-.46.46-.9.74-1.51.98-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4-.61-.24-1.05-.52-1.51-.98-.46-.46-.74-.9-.98-1.51-.16-.46-.35-1.26-.4-2.43-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.16 1.26-.35 2.43-.4 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
      <path d="M12 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zM19.85 5.6a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M18.24 2.25h3.31l-7.23 8.27 8.5 11.23h-6.66l-5.22-6.83-5.97 6.83H1.66l7.73-8.84L1.25 2.25h6.83l4.72 6.24zm-1.16 17.52h1.83L7.02 4.13H5.06z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56z" />
    </svg>
  );
}
