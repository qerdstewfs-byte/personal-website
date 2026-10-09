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
function clock() {
  const now = new Date(); const time = document.querySelector('#clock'); const date = document.querySelector('#clockDate');
  if (time) time.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  if (date) date.textContent = `${new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', month: 'short', day: 'numeric', weekday: 'short' }).format(now)} · Beijing`;
}
clock(); setInterval(clock, 1000);
const access = document.querySelector<HTMLButtonElement>('#editorAccessBtn');
const dialog = document.querySelector<HTMLDialogElement>('#editorAccessDialog');
const form = document.querySelector<HTMLFormElement>('#editorAccessForm');
const password = document.querySelector<HTMLInputElement>('#managementPassword');
const error = document.querySelector<HTMLElement>('#accessError');
const unlock = document.querySelector<HTMLButtonElement>('#unlockBtn');
let editing = false;
function permissions(value: boolean) {
  editing = value;
  if (access) access.textContent = editing ? 'Lock editing' : 'Enable editing';
  const status = document.querySelector('#accessStatus'); if (status) status.textContent = editing ? 'Editor mode' : 'Public view';
  window.dispatchEvent(new CustomEvent('journal:permissions', { detail: { editing } }));
}
fetch('/api/session', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(data => { if (data) permissions(Boolean(data.editing)); }).catch(() => {});
access?.addEventListener('click', async () => {
  if (editing) {
    access.disabled = true;
    try { const response = await fetch('/api/session', { method: 'DELETE' }); if (!response.ok) throw new Error(); permissions(false); }
    catch { access.textContent = 'Could not lock — retry'; }
    finally { access.disabled = false; }
  } else { if (error) error.textContent = ''; dialog?.showModal(); password?.focus(); }
});
document.querySelector('#closeAccess')?.addEventListener('click', () => dialog?.close());
form?.addEventListener('submit', async event => {
  event.preventDefault(); if (!password || !unlock || !error) return;
  unlock.disabled = true; error.textContent = '';
  try {
    const response = await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: password.value }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not unlock editing.');
    password.value = ''; permissions(true); dialog?.close();
  } catch (e) { error.textContent = e instanceof Error ? e.message : 'Connection unavailable. Please retry.'; }
  finally { unlock.disabled = false; }
});
