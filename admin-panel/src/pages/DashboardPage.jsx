import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { fetchReaders, deleteReader } from '../api/readers.js';

export default function DashboardPage() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const data = await fetchReaders();
      setReaders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load readers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This will remove its photo, video, SDK and demo files.`)) return;
    try {
      await deleteReader(id);
      setReaders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete reader');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Readers</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {readers.length} {readers.length === 1 ? 'reader' : 'readers'} in the catalog
            </p>
          </div>
          <Link
            to="/readers/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Reader
          </Link>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : readers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <p className="text-slate-500">No readers yet.</p>
            <Link to="/readers/new" className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:underline">
              Add your first reader
            </Link>
          </div>
        ) : (
          <>
            {/* Card list: small/medium screens, where the table's columns don't fit without clipping. */}
            <div className="flex flex-col gap-3 md:hidden">
              {readers.map((reader) => (
                <div key={reader.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-3">
                    {reader.coverImageUrl ? (
                      <img
                        src={reader.coverImageUrl}
                        alt={reader.name}
                        className="h-14 w-14 shrink-0 rounded-lg border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-100" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">{reader.name}</p>
                      <p className="text-sm text-slate-500">{reader.category || '—'}</p>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          reader.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {reader.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    {reader.images.length} photo{reader.images.length === 1 ? '' : 's'} / {reader.videos.length} video
                    {reader.videos.length === 1 ? '' : 's'} / {reader.sdkFiles.length} SDK / {reader.demoFiles.length} demo
                  </p>

                  <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3 text-sm">
                    <Link to={`/readers/${reader.id}/edit`} className="text-indigo-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(reader.id, reader.name)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Table: md and up, where there's room for every column. */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Photo</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Category</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Files</th>
                      <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {readers.map((reader) => (
                      <tr key={reader.id} className="transition hover:bg-slate-50/60">
                        <td className="px-4 py-3">
                          {reader.coverImageUrl ? (
                            <img
                              src={reader.coverImageUrl}
                              alt={reader.name}
                              className="h-11 w-11 rounded-lg border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-lg bg-slate-100" />
                          )}
                        </td>
                        <td className="max-w-[220px] truncate px-4 py-3 font-medium text-slate-900">{reader.name}</td>
                        <td className="px-4 py-3 text-slate-500">{reader.category || '—'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              reader.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {reader.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {reader.images.length} photo{reader.images.length === 1 ? '' : 's'} / {reader.videos.length} video
                          {reader.videos.length === 1 ? '' : 's'} / {reader.sdkFiles.length} SDK / {reader.demoFiles.length} demo
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Link to={`/readers/${reader.id}/edit`} className="mr-3 text-indigo-600 hover:underline">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(reader.id, reader.name)} className="text-red-600 hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
