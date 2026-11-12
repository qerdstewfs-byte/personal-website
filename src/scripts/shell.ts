import { beijingClock, untilNextMinute } from '../lib/journal-dates';

const themeButton = document.querySelector<HTMLButtonElement>('#themeBtn');
function themeIcon() {
  const label = document.documentElement.dataset.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme';
  if (themeButton) { themeButton.title = label; themeButton.setAttribute('aria-label', label); }
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', document.documentElement.dataset.theme === 'light' ? '#f7f5f0' : '#0f1115');
}
themeIcon();
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  const apply = () => { document.documentElement.dataset.theme = theme; themeIcon(); };
  // Cross-fade the whole page between themes where the View Transitions API exists.
  if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(apply); else apply();
  try { localStorage.setItem('ray-journal-theme', theme); } catch {}
});
const fullscreenButton = document.querySelector<HTMLButtonElement>('#fullscreenBtn');
fullscreenButton?.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { fullscreenButton.title = 'Use your browser’s fullscreen command.'; }
});
document.addEventListener('fullscreenchange', () => {
  const label = document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen';
  if (fullscreenButton) { fullscreenButton.title = label; fullscreenButton.setAttribute('aria-label', label); }
});
const clockTime = document.querySelector('#clock');
const clockDate = document.querySelector('#clockDate');
let clockTimer: ReturnType<typeof setTimeout> | undefined;
function clock() {
  clearTimeout(clockTimer);
  const value = beijingClock();
  if (clockTime && clockTime.textContent !== value.time) clockTime.textContent = value.time;
  if (clockDate && clockDate.textContent !== value.date) clockDate.textContent = value.date;
  if (!document.hidden) clockTimer = setTimeout(clock, untilNextMinute());
}
clock();
document.addEventListener('visibilitychange', clock);

document.addEventListener('astro:before-swap', () => {
  clearTimeout(clockTimer);
  document.removeEventListener('visibilitychange', clock);
}, { once: true });
