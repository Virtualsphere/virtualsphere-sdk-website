import { Link } from 'react-router-dom';

export default function ReaderCard({ reader }) {
  return (
    <Link
      to={`/readers/${reader.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#1A73E8]/30 hover:shadow-lg"
    >
      <div className="relative flex h-44 items-center justify-center bg-slate-50">
        {reader.coverImageUrl ? (
          <img src={reader.coverImageUrl} alt={reader.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-slate-400">No photo</span>
        )}
        {reader.images.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs font-medium text-white">
            1/{reader.images.length}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {reader.category && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wide text-[#1A73E8]">
            {reader.category}
          </span>
        )}
        <h3 className="font-semibold text-slate-900 transition group-hover:text-[#1A73E8]">{reader.name}</h3>
        {reader.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{reader.shortDescription}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-500">
          {reader.videos.length > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-[#1A73E8]">
              {reader.videos.length > 1 ? `${reader.videos.length} Videos` : 'Video'}
            </span>
          )}
          {reader.sdkFiles.length > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-[#1A73E8]">
              {reader.sdkFiles.length > 1 ? `${reader.sdkFiles.length} SDK Files` : 'SDK'}
            </span>
          )}
          {reader.demoFiles.length > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-[#1A73E8]">
              {reader.demoFiles.length > 1 ? `${reader.demoFiles.length} Demo Files` : 'Demo'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
