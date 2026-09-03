import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { fetchVideos, createVideo, updateVideo, deleteVideo } from '../api/videos.js';

const emptyForm = { title: '', youtubeUrl: '', description: '' };

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim() || !form.youtubeUrl.trim()) {
      setFormError('Title and YouTube URL are required.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createVideo(form);
      setVideos((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add video');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete video');
    }
  }

  async function handleTogglePublish(video) {
    try {
      const updated = await updateVideo(video.id, { isPublished: !video.isPublished });
      setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update video');
    }
  }

  function startEdit(video) {
    setEditingId(video.id);
    setEditForm({ title: video.title, youtubeUrl: video.youtubeUrl, description: video.description || '' });
  }

  async function handleSaveEdit(id) {
    setSavingId(id);
    try {
      const updated = await updateVideo(id, editForm);
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update video');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Videos</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Paste a YouTube link to add it to the public Videos page.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="RX-2000 Unboxing & Setup"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">YouTube URL</label>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (optional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Video'}
          </button>
        </form>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : videos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
            No videos yet. Add one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-video w-full bg-slate-900">
                  <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover" />
                  {!video.isPublished && (
                    <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-white">
                      Draft
                    </span>
                  )}
                </div>

                <div className="p-4">
                  {editingId === video.id ? (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <input
                        type="text"
                        value={editForm.youtubeUrl}
                        onChange={(e) => setEditForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        rows={2}
                        className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(video.id)}
                          disabled={savingId === video.id}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                          {savingId === video.id ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="line-clamp-2 font-medium text-slate-900">{video.title}</h3>
                      {video.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{video.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <button onClick={() => handleTogglePublish(video)} className="text-indigo-600 hover:underline">
                          {video.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button onClick={() => startEdit(video)} className="text-slate-600 hover:underline">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(video.id, video.title)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
