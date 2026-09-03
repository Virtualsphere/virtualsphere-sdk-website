// Extracts the 11-character video ID from any common YouTube URL shape
// (watch?v=, youtu.be/, embed/, shorts/) or returns null if it doesn't match.
function extractYoutubeId(url) {
  if (!url || typeof url !== 'string') return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

module.exports = extractYoutubeId;
