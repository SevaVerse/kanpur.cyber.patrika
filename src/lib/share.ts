/**
 * WhatsApp is how cyber-safety content actually travels in Uttar Pradesh, so
 * every guide, poster and briefing gets a one-tap share. `wa.me` opens the app
 * on phones and WhatsApp Web on desktop; no SDK, no tracking.
 */
export function whatsappShareUrl(title: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
}
