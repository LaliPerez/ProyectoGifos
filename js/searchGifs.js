// GIF search and autocomplete powered by the repository's existing GIPHY key.
(() => {
  const GIPHY_API_KEY = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
  const form = document.getElementById("panelB");
  const input = document.getElementById("searchInput");
  const button = document.getElementById("searchBtn");
  const resultsContainer = document.getElementById("resultsContainer");
  const resultsSection = document.getElementById("showResults");
  const resultsTitle = document.getElementById("inputResults");
  const suggestionsMenu = document.getElementById("dropdownSearchContent");
  if (!form || !input || !button || !resultsContainer || !resultsSection || !resultsTitle) return;

  let searchController;
  let autocompleteController;
  let autocompleteTimer;
  const suggestionItems = Array.from(document.querySelectorAll("#dropdownSearchContent .auto"));

  async function fetchGiphy(url, controller) {
    const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) throw new Error(`GIPHY respondió con HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.meta?.status && payload.meta.status >= 400) throw new Error(payload.meta.msg || "Error al consultar GIPHY");
    return payload.data || [];
  }

  function showStatus(message) {
    const status = document.createElement("p");
    status.className = "searchStatus";
    status.setAttribute("role", "status");
    status.textContent = message;
    resultsContainer.replaceChildren(status);
  }

  function makeCard(gif) {
    const url = gif.images?.fixed_height?.url || gif.images?.downsized?.url || gif.images?.original?.url;
    if (!url) return null;
    const titleText = gif.title?.trim() || gif.slug?.replace(/-/g, " ") || "GIF";
    const card = document.createElement("article");
    card.className = "contenedorInternoS";
    const image = document.createElement("img");
    image.className = "gifSea";
    image.src = url;
    image.alt = titleText;
    image.loading = "lazy";
    image.decoding = "async";
    const title = document.createElement("p");
    title.className = "item placeholderSearch";
    title.textContent = titleText;
    card.append(image, title);
    return card;
  }

  async function search(query) {
    const term = String(query || "").trim();
    if (!term) {
      resultsSection.hidden = true;
      resultsContainer.replaceChildren();
      input.focus();
      return;
    }

    searchController?.abort();
    const controller = new AbortController();
    searchController = controller;
    resultsSection.hidden = false;
    resultsTitle.textContent = `Resultados de búsqueda: ${term}`;
    showStatus("Buscando GIFs…");

    const params = new URLSearchParams({ api_key: GIPHY_API_KEY, q: term, limit: "18", rating: "g" });
    try {
      const gifs = await fetchGiphy(`https://api.giphy.com/v1/gifs/search?${params.toString()}`, controller);
      if (controller.signal.aborted) return;
      const cards = gifs.map(makeCard).filter(Boolean);
      if (!cards.length) {
        showStatus("No encontramos GIFs para esa búsqueda. Probá con otras palabras.");
        return;
      }
      const fragment = document.createDocumentFragment();
      cards.forEach((card) => fragment.appendChild(card));
      resultsContainer.replaceChildren(fragment);
    } catch (error) {
      if (error.name !== "AbortError" && !controller.signal.aborted) {
        showStatus(`No se pudieron cargar los GIFs: ${error.message}. Intentá nuevamente.`);
        console.error("Error al buscar GIFs:", error);
      }
    }
  }

  function closeAutocomplete() {
    if (suggestionsMenu) suggestionsMenu.style.display = "none";
    input.setAttribute("aria-expanded", "false");
  }

  async function autocomplete(query) {
    const term = String(query || "").trim();
    if (!term) {
      autocompleteController?.abort();
      suggestionItems.forEach((item) => { item.textContent = ""; item.hidden = true; });
      closeAutocomplete();
      return;
    }
    autocompleteController?.abort();
    const controller = new AbortController();
    autocompleteController = controller;
    const params = new URLSearchParams({ api_key: GIPHY_API_KEY, q: term, limit: String(suggestionItems.length) });
    try {
      const tags = await fetchGiphy(`https://api.giphy.com/v1/gifs/search/tags?${params.toString()}`, controller);
      if (controller.signal.aborted) return;
      let count = 0;
      suggestionItems.forEach((item, index) => {
        item.textContent = tags[index]?.name || "";
        item.hidden = !item.textContent;
        if (!item.hidden) count += 1;
      });
      if (count) {
        suggestionsMenu.style.display = "block";
        input.setAttribute("aria-expanded", "true");
      } else closeAutocomplete();
    } catch (error) {
      if (error.name !== "AbortError") closeAutocomplete();
    }
  }

  // Form submit handles both Enter and browsers' normal submit behavior.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    closeAutocomplete();
    search(input.value);
  });

  // Explicit click handler also supports pages/themes that interfere with native form submission.
  button.addEventListener("click", (event) => {
    event.preventDefault();
    closeAutocomplete();
    search(input.value);
  });

  input.addEventListener("input", () => {
    window.clearTimeout(autocompleteTimer);
    autocompleteTimer = window.setTimeout(() => autocomplete(input.value), 250);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAutocomplete();
    if (event.key === "ArrowDown") {
      const next = suggestionItems.find((item) => !item.hidden);
      if (next) { event.preventDefault(); next.focus(); }
    }
  });
  suggestionItems.forEach((item) => {
    item.addEventListener("click", () => {
      const term = item.textContent.trim();
      if (!term) return;
      input.value = term;
      closeAutocomplete();
      search(term);
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); item.click(); }
      if (event.key === "Escape") { closeAutocomplete(); input.focus(); }
    });
  });
  document.addEventListener("click", (event) => {
    if (!form.contains(event.target) && !suggestionsMenu?.contains(event.target)) closeAutocomplete();
  });
  window.search = search;
})();
