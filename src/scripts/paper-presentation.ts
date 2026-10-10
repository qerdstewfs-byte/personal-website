const deck = document.querySelector<HTMLElement>("[data-paper-deck]");

if (deck) {
  const slides = [...deck.querySelectorAll<HTMLElement>("[data-slide]")];
  const picker = deck.querySelector<HTMLSelectElement>("[data-slide-picker]")!;
  const previous = deck.querySelector<HTMLButtonElement>("[data-slide-prev]")!;
  const next = deck.querySelector<HTMLButtonElement>("[data-slide-next]")!;
  const count = deck.querySelector<HTMLElement>("[data-slide-count]")!;
  const reading = deck.querySelector<HTMLButtonElement>("[data-reading-toggle]")!;
  const present = deck.querySelector<HTMLButtonElement>("[data-present-toggle]")!;
  const message = deck.querySelector<HTMLElement>("[data-deck-message]")!;
  let current = 0;
  let readAll = false;
  let restoreOverflow = "";
  let focusBeforeExpansion: HTMLElement | null = null;

  const indexFromHash = () => slides.findIndex((slide) => `#${slide.id}` === window.location.hash);
  function render(updateHash = false) {
    deck!.dataset.mode = readAll ? "reading" : "slides";
    slides.forEach((slide, index) => { slide.hidden = !readAll && index !== current; });
    picker.value = slides[current].dataset.slide!;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    count.textContent = `${current + 1} / ${slides.length}`;
    reading.textContent = readAll ? "Present" : "Read all";
    reading.setAttribute("aria-pressed", String(readAll));
    if (updateHash) window.history.replaceState(null, "", `#${slides[current].id}`);
  }
  function go(index: number) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    render(true);
    if (document.activeElement === next && next.disabled) previous.focus({ preventScroll: true });
    if (document.activeElement === previous && previous.disabled) next.focus({ preventScroll: true });
    slides[current].scrollTop = 0;
    const stage = deck!.querySelector<HTMLElement>(".deck-stage")!;
    stage.scrollTop = 0;
    if (readAll) slides[current].scrollIntoView({ block: "start", behavior: "instant" });
    else if (deck!.getBoundingClientRect().top < 0 && !document.fullscreenElement && deck!.dataset.expanded !== "true") deck!.scrollIntoView({ block: "start", behavior: "instant" });
  }
  previous.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));
  picker.addEventListener("change", () => go(slides.findIndex((slide) => slide.dataset.slide === picker.value)));
  reading.addEventListener("click", () => { readAll = !readAll; render(); });
  window.addEventListener("hashchange", () => { const index = indexFromHash(); if (index >= 0) go(index); });
  deck.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || (event.target instanceof Element && event.target.closest("input,textarea,select,[contenteditable]"))) return;
    if (event.key === "Escape" && deck.dataset.expanded === "true") { collapse(); return; }
    if (readAll) return;
    const destinations: Record<string, number> = { ArrowRight: current + 1, PageDown: current + 1, ArrowLeft: current - 1, PageUp: current - 1, Home: 0, End: slides.length - 1 };
    const target = destinations[event.key];
    if (target === undefined) return;
    event.preventDefault();
    go(target);
  });
  function fullscreenState() {
    const active = document.fullscreenElement === deck || deck!.dataset.expanded === "true";
    present.textContent = active ? "Exit fullscreen" : "Fullscreen";
    present.setAttribute("aria-pressed", String(active));
  }
  function collapse() {
    delete deck!.dataset.expanded;
    document.body.style.overflow = restoreOverflow;
    fullscreenState();
    focusBeforeExpansion?.focus();
  }
  present.addEventListener("click", async () => {
    if (deck.dataset.expanded === "true") { collapse(); return; }
    if (document.fullscreenElement === deck) { await document.exitFullscreen(); return; }
    try {
      if (!deck.requestFullscreen) throw new Error("Fullscreen unavailable");
      await deck.requestFullscreen();
    } catch {
      focusBeforeExpansion = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      restoreOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      deck.dataset.expanded = "true";
      message.textContent = "Expanded presentation. Press Escape to exit.";
      fullscreenState();
    }
    deck.focus({ preventScroll: true });
  });
  document.addEventListener("fullscreenchange", fullscreenState);
  // An expanded fallback acts as a modal and keeps keyboard focus inside the deck.
  deck.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || deck.dataset.expanded !== "true") return;
    const items = [...deck.querySelectorAll<HTMLElement>("a[href],button,select,[tabindex='0']")].filter((item) => !item.closest("[hidden]") && !(item instanceof HTMLButtonElement && item.disabled));
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === deck)) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  current = Math.max(0, indexFromHash());
  render();
  deck.querySelectorAll<HTMLElement>("[data-deck-controls]").forEach((control) => { control.hidden = false; });
}
