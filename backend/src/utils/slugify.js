// Turns a reader name into a URL-friendly slug,
// e.g. "UDT9R RFID Smart Jewellery Tray Reader" -> "udt9r-rfid-smart-jewellery-tray-reader".
function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = slugify;
