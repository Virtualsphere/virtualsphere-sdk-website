import { useState } from 'react';

const fileInputClass =
  'block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200';

/**
 * Manages one media category (photos, videos, sdk files, demo files) in the reader form.
 * - Existing items (already saved on the reader) delete immediately via the API.
 * - Newly picked files are staged client-side and only uploaded when the form is saved.
 */
export default function MediaSection({
  label,
  accept,
  kind, // 'image' | 'video' | 'file'
  existingItems, // [{ id, url?, name? }]
  onDeleteExisting, // async (id) => void
  stagedFiles,
  onStagedFilesChange,
}) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDeleteExisting(id) {
    if (!window.confirm('Remove this item?')) return;
    setDeletingId(id);
    try {
      await onDeleteExisting(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  }

  function handleFilesPicked(e) {
    const picked = Array.from(e.target.files || []);
    if (picked.length) onStagedFilesChange([...stagedFiles, ...picked]);
    e.target.value = '';
  }

  function removeStaged(index) {
    onStagedFilesChange(stagedFiles.filter((_, i) => i !== index));
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>

      {(existingItems.length > 0 || stagedFiles.length > 0) && (
        <div className="mb-2 flex flex-wrap gap-2">
          {existingItems.map((item) => (
            <MediaChip
              key={`existing-${item.id}`}
              kind={kind}
              url={item.url}
              name={item.name}
              disabled={deletingId === item.id}
              onRemove={() => handleDeleteExisting(item.id)}
            />
          ))}
          {stagedFiles.map((file, index) => (
            <MediaChip
              key={`staged-${index}`}
              kind={kind}
              url={kind !== 'file' ? URL.createObjectURL(file) : undefined}
              name={file.name}
              pending
              onRemove={() => removeStaged(index)}
            />
          ))}
        </div>
      )}

      <input type="file" accept={accept} multiple onChange={handleFilesPicked} className={fileInputClass} />
    </div>
  );
}

function MediaChip({ kind, url, name, pending, disabled, onRemove }) {
  return (
    <div
      className={`relative flex items-center gap-2 rounded-lg border p-1.5 pr-2 text-xs ${
        pending ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white'
      }`}
    >
      {kind === 'image' && url && (
        <img src={url} alt="" className="h-10 w-10 rounded object-cover" />
      )}
      {kind === 'video' && url && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={url} className="h-10 w-14 rounded bg-black object-contain" />
      )}
      {(kind === 'file' || !url) && (
        <span className="max-w-[140px] truncate text-slate-700">{name || 'File'}</span>
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Remove"
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
