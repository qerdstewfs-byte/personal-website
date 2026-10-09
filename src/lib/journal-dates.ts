const TIME_ZONE = 'Asia/Shanghai';
const formatters = new Map<string, Intl.DateTimeFormat>();
const labels = new Map<string, string>();
const hourFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', hour12: false });
const savedFormatter = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
const clockFormatter = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit', hour12: false });
const clockDateFormatter = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, month: 'short', day: 'numeric', weekday: 'short' });

export function formatJournalDate(date: string, options: Intl.DateTimeFormatOptions = {}) {
  const key = JSON.stringify(Object.entries(options).sort(([a], [b]) => a.localeCompare(b)));
  const labelKey = `${date}:${key}`;
  const existing = labels.get(labelKey);
  if (existing !== undefined) return existing;
  let formatter = formatters.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', { ...options, timeZone: TIME_ZONE });
    formatters.set(key, formatter);
  }
  const label = formatter.format(new Date(`${date}T12:00:00+08:00`));
  // Keep a few years of calendar labels without growing for every year visited.
  if (labels.size >= 1200) labels.delete(labels.keys().next().value!);
  labels.set(labelKey, label);
  return label;
}

export function beijingHour(now = new Date()) { return Number(hourFormatter.format(now)); }
export function formatSavedTime(value: string) { return savedFormatter.format(new Date(value)); }
export function beijingClock(now = new Date()) {
  return { time: clockFormatter.format(now), date: `${clockDateFormatter.format(now)} · Beijing` };
}
export function untilNextMinute(now = Date.now()) { return 60_000 - now % 60_000 + 20; }
