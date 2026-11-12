const search = document.querySelector<HTMLInputElement>('#resourceSearch');
const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-search]'));
const clearButton = document.querySelector<HTMLButtonElement>('#clearSearch');
const resultCount = document.querySelector<HTMLElement>('#resultCount');
const emptyState = document.querySelector<HTMLElement>('#emptyState');
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim();

function filterResources() {
  const terms = normalize(search?.value ?? '').split(/\s+/).filter(Boolean);
  let visible = 0;
  for (const card of cards) {
    const text = normalize(card.dataset.search ?? '');
    card.hidden = !terms.every(term => text.includes(term));
    if (!card.hidden) visible += 1;
  }
  if (resultCount) resultCount.textContent = `${visible} 个文件`;
  if (emptyState) emptyState.hidden = visible > 0;
  if (clearButton) clearButton.hidden = !search?.value;
}

function resetSearch() {
  if (!search) return;
  search.value = '';
  filterResources();
  search.focus();
}

if (search) {
  document.querySelector<HTMLElement>('#searchToolbar')?.removeAttribute('hidden');
  search.addEventListener('input', filterResources);
  clearButton?.addEventListener('click', resetSearch);
  document.querySelector('#resetSearch')?.addEventListener('click', resetSearch);
  filterResources();
}
