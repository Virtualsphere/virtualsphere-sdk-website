// Accepts the raw `features` field from a multipart/form-data body.
// Client is expected to send it as a JSON-stringified array of strings,
// e.g. features: '["Long range", "IP65 rated"]'. Falls back to
// newline/comma separated plain text for convenience.
function parseFeatures(raw) {
  if (raw === undefined || raw === null || raw === '') return [];
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean);

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(String).map((s) => s.trim()).filter(Boolean);
    }
  } catch (err) {
    // not JSON, fall through to plain text parsing
  }

  return String(raw)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

module.exports = parseFeatures;
