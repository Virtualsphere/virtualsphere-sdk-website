import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import PageHero from '../components/PageHero.jsx';
import ReaderCard from '../components/ReaderCard.jsx';
import VideoCard from '../components/VideoCard.jsx';
import VideoLightbox from '../components/VideoLightbox.jsx';
import { fetchReaders } from '../api/readers.js';
import { fetchVideos } from '../api/videos.js';

const ALL_CATEGORY = 'All';
const UNCATEGORIZED = 'Uncategorized';

export default function HomePage() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);

  const [videos, setVideos] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);

  const location = useLocation();

  useEffect(() => {
    fetchReaders()
      .then(setReaders)
      .catch(() => setError('Failed to load readers. Please try again later.'))
      .finally(() => setLoading(false));

    fetchVideos()
      .then(setVideos)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (location.hash === '#videos') {
      document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash, videos]);

  const categories = useMemo(() => {
    const found = new Set(readers.map((r) => r.category || UNCATEGORIZED));
    return [ALL_CATEGORY, ...[...found].sort()];
  }, [readers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return readers.filter((r) => {
      const category = r.category || UNCATEGORIZED;
      const matchesCategory = activeCategory === ALL_CATEGORY || category === activeCategory;
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.shortDescription || '').toLowerCase().includes(q) ||
        (r.features || []).some((f) => f.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [readers, search, activeCategory]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <PageHero
        eyebrow="RFID Reader Catalog"
        title="Find the right RFID reader for your project"
        subtitle="Browse our full lineup of handheld and fixed RFID readers, watch product videos, and download SDKs & demo software."
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {videos.length > 0 && (
          <div id="videos" className="mb-14 scroll-mt-20">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Watch Our Videos</h2>
              <p className="mt-0.5 text-sm text-slate-500">Product walkthroughs and demos.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} onPlay={setActiveVideo} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">All Readers</h2>
            <p className="mt-0.5 text-sm text-slate-500">{readers.length} reader{readers.length === 1 ? '' : 's'} available</p>
          </div>

          <div className="relative w-full sm:w-72">
            <svg
              viewBox="0 0 24 24"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-3.5-3.5" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search readers..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 transition focus:border-[#1A73E8] focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/20"
            />
          </div>
        </div>

        {categories.length > 2 && (
          <div className="mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? 'bg-[#1A73E8] text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
            No readers found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((reader) => (
              <ReaderCard key={reader.id} reader={reader} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <VideoLightbox video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
