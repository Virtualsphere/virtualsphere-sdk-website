export default function VideoCard({ video, onPlay }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(video)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#1A73E8] shadow-md transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
          YouTube
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold text-slate-900 transition group-hover:text-[#1A73E8]">
          {video.title}
        </h3>
        {video.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{video.description}</p>
        )}
      </div>
    </button>
  );
}
