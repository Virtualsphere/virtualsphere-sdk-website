import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Carousel from '../components/Carousel.jsx';
import { fetchReader } from '../api/readers.js';

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" />
    </svg>
  );
}

function FileList({ title, files, primary }) {
  if (files.length === 0) return null;
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium text-slate-900">{title}</h2>
      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <a
            key={file.id}
            href={file.downloadUrl}
            className={
              primary
                ? 'inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1560c9]'
                : 'inline-flex items-center gap-2 rounded-lg border border-[#1A73E8] px-4 py-2 text-sm font-medium text-[#1A73E8] transition hover:bg-blue-50'
            }
          >
            <DownloadIcon />
            <span>Download</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ReaderDetailPage() {
  const { id } = useParams();
  const [reader, setReader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReader(id)
      .then(setReader)
      .catch(() => setError('Reader not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all readers
        </Link>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : error ? (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-6 p-5 sm:flex-row sm:p-6">
              <div className="h-48 w-full rounded-xl bg-slate-50 sm:h-56 sm:w-56 sm:shrink-0">
                {reader.images.length > 0 ? (
                  <Carousel
                    items={reader.images}
                    className="h-full w-full rounded-xl"
                    renderItem={(img) => (
                      <img src={img.url} alt={reader.name} className="h-48 w-full object-cover sm:h-56" />
                    )}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-slate-400">No photo</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                {reader.category && (
                  <span className="mb-1 inline-block text-xs font-medium uppercase tracking-wide text-[#1A73E8]">
                    {reader.category}
                  </span>
                )}
                <h1 className="text-2xl font-semibold text-slate-900">{reader.name}</h1>
                {reader.shortDescription && <p className="mt-1 text-slate-600">{reader.shortDescription}</p>}

                {reader.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">{reader.description}</p>
                )}

                {reader.features?.length > 0 && (
                  <div className="mt-4">
                    <h2 className="mb-2 text-sm font-medium text-slate-900">Features</h2>
                    <ul className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-slate-600 sm:grid-cols-2">
                      {reader.features.map((feature, i) => (
                        <li key={i} className="flex gap-1.5">
                          <span className="text-[#1A73E8]">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {reader.videos.length > 0 && (
                  <div className="mt-4">
                    <h2 className="mb-2 text-sm font-medium text-slate-900">
                      {reader.videos.length > 1 ? 'Product Videos' : 'Product Video'}
                    </h2>
                    <Carousel
                      items={reader.videos}
                      className="aspect-video w-full max-w-xs rounded-lg bg-black shadow-sm"
                      renderItem={(vid) => (
                        // eslint-disable-next-line jsx-a11y/media-has-caption
                        <video src={vid.url} controls className="aspect-video w-full bg-black" />
                      )}
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-4">
                  <FileList title="SDK Files" files={reader.sdkFiles} primary />
                  <FileList title="Demo Software" files={reader.demoFiles} />
                  {reader.sdkFiles.length === 0 && reader.demoFiles.length === 0 && (
                    <p className="text-sm text-slate-400">No downloads available yet for this reader.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
