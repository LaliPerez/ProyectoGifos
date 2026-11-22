// GIF search and autocomplete powered by the repository's existing GIPHY key.
(() => {
  const GIPHY_API_KEY = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
  const form = document.getElementById("panelB");
  const input = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");
  const resultsSection = document.getElementById("showResults");
  const resultsTitle = document.getElementById("inputResults");
  const suggestionsMenu = document.getElementById("dropdownSearchContent");

  if (!form || !input || !resultsContainer || !resultsSection || !resultsTitle) return;

  let searchController;
  let autocompleteController;
  let autocompleteTimer;

  const getSuggestionItems = () => Array.from(document.querySelectorAll("#dropdownSearchContent .auto"));

  async function fetchGiphy(url, controller) {
    const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
    if (!response.ok) throw new Error(`GIPHY respondió con HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.meta?.status && payload.meta.status >= 400) {
      throw new Error(payload.meta.msg || "Error al consultar GIPHY");
    }
    return payload.data || [];
  }

  function getGifTitle(item) {
    return item.title?.trim() || item.slug?.replace(/-/g, " ") || "GIF";
  }

  function createGifCard(item) {
    const imageUrl = item.images?.fixed_height?.url || item.images?.downsized?.url || item.images?.original?.url;
    if (!imageUrl) return null;

    const card = document.createElement("article");
    card.className = "contenedorInternoS";

    const image = document.createElement("img");
    image.className = "gifSea";
    image.src = imageUrl;
    image.alt = getGifTitle(item);
    image.loading = "lazy";
    image.decoding = "async";

    const title = document.createElement("p");
    title.className = "item placeholderSearch";
    title.textContent = getGifTitle(item);
    card.append(image, title);
    return card;
  }

  function showStatus(message) {
    resultsContainer.replaceChildren();
    const status = document.createElement("p");
    status.className = "searchStatus";
    status.setAttribute("role", "status");
    status.textContent = message;
    resultsContainer.appendChild(status);
  }

  async function search(query) {
    const cleanQuery = String(query || "").trim();
    if (!cleanQuery) {
      searchController?.abort();
      resultsSection.hidden = true;
      resultsContainer.replaceChildren();
      input.focus();
      return;
    }

    searchController?.abort();
    const controller = new AbortController();
    searchController = controller;

    resultsSection.hidden = false;
    resultsTitle.textContent = `Resultados de búsqueda: ${cleanQuery}`;
    showStatus("Buscando GIFs…");

    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: cleanQuery,
      limit: "18",
      rating: "g",
      lang: "es"
    });

    try {
      const gifs = await fetchGiphy(`https://api.giphy.com/v1/gifs/search?${params}`, controller);
      if (controller.signal.aborted) return;

      const cards = gifs.map(createGifCard).filter(Boolean);
      if (!cards.length) {
        showStatus("No encontramos GIFs para esa búsqueda. Probá con otras palabras.");
        return;
      }

      const fragment = document.createDocumentFragment();
      cards.forEach((card) => fragment.appendChild(card));
      resultsContainer.replaceChildren(fragment);
    } catch (error) {
      if (error.name !== "AbortError" && !controller.signal.aborted) {
        showStatus("No se pudieron cargar los GIFs. Revisá tu conexión e intentá nuevamente.");
        console.error("Error al buscar GIFs:", error);
      }
    }
  }

  function closeAutocomplete() {
    if (suggestionsMenu) suggestionsMenu.style.display = "none";
    input.setAttribute("aria-expanded", "false");
  }

  function openAutocomplete() {
    if (suggestionsMenu) suggestionsMenu.style.display = "block";
    input.setAttribute("aria-expanded", "true");
  }

  async function autocomplete(query) {
    const cleanQuery = String(query || "").trim();
    const items = getSuggestionItems();
    if (!cleanQuery) {
      autocompleteController?.abort();
      items.forEach((item) => { item.textContent = ""; item.hidden = true; });
      closeAutocomplete();
      return;
    }

    autocompleteController?.abort();
    const controller = new AbortController();
    autocompleteController = controller;
    const params = new URLSearchParams({ api_key: GIPHY_API_KEY, q: cleanQuery, limit: String(items.length), lang: "es" });

    try {
      const tags = await fetchGiphy(`https://api.giphy.com/v1/gifs/search/tags?${params}`, controller);
      if (controller.signal.aborted) return;

      let visibleCount = 0;
      items.forEach((item, index) => {
        const label = tags[index]?.name?.trim() || "";
        item.textContent = label;
        item.hidden = !label;
        if (label) visibleCount += 1;
      });
      if (visibleCount) openAutocomplete();
      else closeAutocomplete();
    } catch (error) {
      if (error.name !== "AbortError") closeAutocomplete();
    }
  }

  form.addEventListener("submit", (event) => {
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
      const first = getSuggestionItems().find((item) => !item.hidden);
      if (first) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  getSuggestionItems().forEach((item) => {
    item.addEventListener("click", () => {
      const term = item.textContent.trim();
      if (!term) return;
      input.value = term;
      closeAutocomplete();
      search(term);
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
      }
      if (event.key === "Escape") {
        closeAutocomplete();
        input.focus();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!form.contains(event.target) && !suggestionsMenu?.contains(event.target)) closeAutocomplete();
  });

  window.search = search;
})();
