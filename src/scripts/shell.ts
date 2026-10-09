import { beijingClock, untilNextMinute } from '../lib/journal-dates';
import { journalPermissions } from '../lib/permissions';

const themeButton = document.querySelector<HTMLButtonElement>('#themeBtn');
function themeIcon() { if (themeButton) themeButton.textContent = document.documentElement.dataset.theme === 'light' ? '☾' : '☼'; }
themeIcon();
themeButton?.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme; themeIcon();
  try { localStorage.setItem('ray-journal-theme', theme); } catch {}
});
const fullscreenButton = document.querySelector<HTMLButtonElement>('#fullscreenBtn');
fullscreenButton?.addEventListener('click', async () => {
  try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
  catch { fullscreenButton.title = 'Use your browser’s fullscreen command.'; }
});
document.addEventListener('fullscreenchange', () => {
  const label = fullscreenButton?.querySelector('.button-label'); if (label) label.textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen';
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
const access = document.querySelector<HTMLButtonElement>('#editorAccessBtn');
const dialog = document.querySelector<HTMLDialogElement>('#editorAccessDialog');
const form = document.querySelector<HTMLFormElement>('#editorAccessForm');
const password = document.querySelector<HTMLInputElement>('#managementPassword');
const error = document.querySelector<HTMLElement>('#accessError');
const unlock = document.querySelector<HTMLButtonElement>('#unlockBtn');
let editing = false;
const unsubscribePermissions = journalPermissions.subscribe(value => {
  editing = value.editing;
  if (access) access.textContent = editing ? 'Lock editing' : 'Enable editing';
  const status = document.querySelector('#accessStatus'); if (status) status.textContent = editing ? 'Editor mode' : 'Public view';
});
// The daily journal already returns permission state with its records.
// Library pages still need a session read to update owner controls.
if (!document.getElementById('dailyBoard')) {
  const revision = journalPermissions.revision;
  fetch('/api/session', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(data => {
    if (data) journalPermissions.applyRead(Boolean(data.editing), revision, 'session');
  }).catch(() => {});
}
access?.addEventListener('click', async () => {
  if (editing) {
    access.disabled = true;
    const revision = journalPermissions.beginAction();
    try { const response = await fetch('/api/session', { method: 'DELETE' }); if (!response.ok) throw new Error(); journalPermissions.finishAction(false, revision); }
    catch { access.textContent = 'Could not lock — retry'; }
    finally { access.disabled = false; }
  } else { if (error) error.textContent = ''; dialog?.showModal(); password?.focus(); }
});
document.querySelector('#closeAccess')?.addEventListener('click', () => dialog?.close());
form?.addEventListener('submit', async event => {
  event.preventDefault(); if (!password || !unlock || !error) return;
  unlock.disabled = true; error.textContent = '';
  const revision = journalPermissions.beginAction();
  try {
    const response = await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: password.value }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not unlock editing.');
    password.value = ''; journalPermissions.finishAction(true, revision); dialog?.close();
  } catch (e) { error.textContent = e instanceof Error ? e.message : 'Connection unavailable. Please retry.'; }
  finally { unlock.disabled = false; }
});
document.addEventListener('astro:before-swap', () => {
  clearTimeout(clockTimer);
  document.removeEventListener('visibilitychange', clock);
  unsubscribePermissions();
}, { once: true });
