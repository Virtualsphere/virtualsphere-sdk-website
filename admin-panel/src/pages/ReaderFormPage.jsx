import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import MediaSection from '../components/MediaSection.jsx';
import {
  createReader,
  deleteReaderFile,
  deleteReaderImage,
  deleteReaderVideo,
  fetchReader,
  fetchReaders,
  updateReader,
} from '../api/readers.js';

const emptyForm = {
  name: '',
  category: '',
  shortDescription: '',
  description: '',
  isPublished: true,
};

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';
const sectionClass = 'space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

export default function ReaderFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [features, setFeatures] = useState(['']);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [sdkFiles, setSdkFiles] = useState([]);
  const [demoFiles, setDemoFiles] = useState([]);
  const [existing, setExisting] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReaders()
      .then((readers) => {
        const categories = [...new Set(readers.map((r) => r.category).filter(Boolean))].sort();
        setCategoryOptions(categories);
      })
      .catch(() => {});
  }, []);

  function loadReader() {
    return fetchReader(id).then((data) => {
      setForm({
        name: data.name,
        category: data.category || '',
        shortDescription: data.shortDescription || '',
        description: data.description || '',
        isPublished: data.isPublished,
      });
      setFeatures(data.features && data.features.length ? data.features : ['']);
      setExisting(data);
    });
  }

  useEffect(() => {
    if (!isEdit) return;
    loadReader()
      .catch((err) => setError(err.response?.data?.message || 'Failed to load reader'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateFeature(index, value) {
    setFeatures((prev) => prev.map((f, i) => (i === index ? value : f)));
  }

  function addFeature() {
    setFeatures((prev) => [...prev, '']);
  }

  function removeFeature(index) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = {
      ...form,
      features: features.map((f) => f.trim()).filter(Boolean),
      photos,
      videos,
      sdkFiles,
      demoFiles,
    };

    try {
      if (isEdit) {
        await updateReader(id, payload);
      } else {
        await createReader(payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save reader');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-8 text-slate-500 sm:px-6">Loading...</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to readers
        </button>

        <h1 className="mb-6 text-2xl font-semibold text-slate-900">{isEdit ? 'Edit Reader' : 'Add Reader'}</h1>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className={sectionClass}>
            <label className="block">
              <span className={labelClass}>Name *</span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Category</span>
              <input
                type="text"
                list="category-options"
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                placeholder="e.g. Fixed RFID Reader, Handheld RFID Reader"
                className={inputClass}
              />
              <datalist id="category-options">
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </label>

            <label className="block">
              <span className={labelClass}>Short description</span>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                placeholder="One-line summary shown on the catalog card"
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className={labelClass}>Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                className={inputClass}
              />
            </label>

            <div>
              <span className={labelClass}>Features</span>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className={`flex-1 ${inputClass}`}
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="rounded-lg border border-slate-300 px-3 text-sm text-slate-500 transition hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addFeature} className="mt-2 text-sm font-medium text-indigo-600 hover:underline">
                + Add feature
              </button>
            </div>
          </div>

          <div className={sectionClass}>
            <h2 className="text-sm font-semibold text-slate-900">Media &amp; Downloads</h2>

            <MediaSection
              label="Photos"
              accept="image/*"
              kind="image"
              existingItems={existing?.images || []}
              onDeleteExisting={(imageId) => deleteReaderImage(id, imageId).then(loadReader)}
              stagedFiles={photos}
              onStagedFilesChange={setPhotos}
            />

            <MediaSection
              label="Videos"
              accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
              kind="video"
              existingItems={existing?.videos || []}
              onDeleteExisting={(videoId) => deleteReaderVideo(id, videoId).then(loadReader)}
              stagedFiles={videos}
              onStagedFilesChange={setVideos}
            />

            <MediaSection
              label="SDK files (.zip or .rar)"
              accept=".zip,.rar"
              kind="file"
              existingItems={existing?.sdkFiles || []}
              onDeleteExisting={(fileId) => deleteReaderFile(id, fileId).then(loadReader)}
              stagedFiles={sdkFiles}
              onStagedFilesChange={setSdkFiles}
            />

            <MediaSection
              label="Demo software files (.zip or .rar)"
              accept=".zip,.rar"
              kind="file"
              existingItems={existing?.demoFiles || []}
              onDeleteExisting={(fileId) => deleteReaderFile(id, fileId).then(loadReader)}
              stagedFiles={demoFiles}
              onStagedFilesChange={setDemoFiles}
            />
          </div>

          <div className={sectionClass}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => updateField('isPublished', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/40"
              />
              <span className="text-sm text-slate-700">Published (visible on public website)</span>
            </label>
          </div>

          <div className="flex gap-3 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create reader'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
