const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});
const dateFormatterWithYear = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
const manifestDateFormatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' });
const timeFormatter = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

export function formatDeparture(iso: string): string {
  const date = new Date(iso);
  return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

/** e.g. "Tue 14 Jul 2026" — used where the year needs to be explicit. */
export function formatDepartureDate(iso: string): string {
  return dateFormatterWithYear.format(new Date(iso));
}

/** e.g. "7:00 AM" */
export function formatDepartureTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

/** e.g. "02 Jul 2026" — for short, dateline-only values like a paid-on date. */
export function formatShortDate(iso: string): string {
  return shortDateFormatter.format(new Date(iso));
}

/** e.g. "13 Jul, 6:00 PM" — for manifest/cutoff style timestamps. */
export function formatManifestClose(iso: string): string {
  const date = new Date(iso);
  return `${manifestDateFormatter.format(date)}, ${timeFormatter.format(date)}`;
}
