// GIF search and API helpers
(() => {
  const GIPHY_API_KEY = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
  const form = document.getElementById("panelB");
  const input = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("resultsContainer");
  const resultsSection = document.getElementById("showResults");
  const resultsTitle = document.getElementById("inputResults");
  const suggestionsMenu = document.getElementById("dropdownSearchContent");

  if (!form || !input || !resultsContainer || !resultsSection || !resultsTitle) return;

  let searchController = null;
  let autocompleteController = null;
  let autocompleteTimer = null;

  async function fetchGiphy(url, controller) {
    const response = await fetch(url, { signal: controller?.signal });
    if (!response.ok) throw new Error(`Giphy respondió con ${response.status}`);

    const payload = await response.json();
    if (payload.meta?.status && payload.meta.status >= 400) {
      throw new Error(payload.meta.msg || "Error al consultar Giphy");
    }
    return payload.data || [];
  }

  function gifTitle(item) {
    const title = item.title?.trim();
    if (title) return title;
    return item.slug?.replaceAll("-", " ").trim() || "GIF";
  }

  function createGifCard(item) {
    const card = document.createElement("div");
    card.className = "contenedorInternoS";

    const image = document.createElement("img");
    image.className = "gifSea";
    image.src = item.images?.downsized?.url || item.images?.fixed_height?.url || "";
    image.alt = gifTitle(item);
    image.loading = "lazy";
    image.style.width = "100%";
    image.style.height = "298px";
    image.style.objectFit = "cover";

    const title = document.createElement("div");
    title.className = "item placeholderSearch";
    title.textContent = gifTitle(item);
    title.style.textOverflow = "ellipsis";
    title.style.overflow = "hidden";

    card.append(image, title);
    return card;
  }

  function setSearchStatus(message) {
    resultsContainer.innerHTML = "";
    const status = document.createElement("p");
    status.className = "searchStatus";
    status.textContent = message;
    resultsContainer.appendChild(status);
  }

  async function search(query) {
    const cleanedQuery = query?.trim();
    if (!cleanedQuery) {
      resultsSection.style.display = "none";
      return;
    }

    if (searchController) searchController.abort();
    searchController = new AbortController();

    resultsSection.style.display = "block";
    resultsTitle.textContent = `Resultados de búsqueda: ${cleanedQuery}`;
    setSearchStatus("Cargando GIFs…");

    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: cleanedQuery,
      limit: "18",
      rating: "g"
    });

    try {
      const data = await fetchGiphy(
        `https://api.giphy.com/v1/gifs/search?${params.toString()}`,
        searchController
      );

      resultsContainer.innerHTML = "";
      if (!data.length) {
        setSearchStatus("No encontramos GIFs para esa búsqueda.");
        return;
      }

      const fragment = document.createDocumentFragment();
      data.forEach((item) => fragment.appendChild(createGifCard(item)));
      resultsContainer.appendChild(fragment);
    } catch (error) {
      if (error.name !== "AbortError") {
        setSearchStatus("No se pudieron cargar los resultados. Intentá nuevamente.");
        console.error("Error al buscar GIFs:", error);
      }
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (suggestionsMenu) suggestionsMenu.style.display = "none";
    search(input.value);
  });

  function closeAutocomplete() {
    if (suggestionsMenu) suggestionsMenu.style.display = "none";
  }

  function openAutocomplete() {
    if (suggestionsMenu) suggestionsMenu.style.display = "block";
  }

  async function autocomplete(query) {
    const cleanedQuery = query.trim();
    const items = Array.from(document.queryElementsByClassName("auto"));

    if (!cleanedQuery) {
      closeAutocomplete();
      items.forEach((item) => {
        item.textContent = "";
        item.removeAttribute("href");
      });
      return;
    }

    if (autocompleteController) autocompleteController.abort();
    autocompleteController = new AbortController();

    const params = new URLSearchParams({
      api_key: GIPHY_API_KEY,
      q: cleanedQuery,
      limit: "6"
    });

    try {
      const data = await fetchGiphy(
        `https://api.giphy.com/v1/gifs/search/tags?${params.toString()}`,
        autocompleteController
      );

      items.forEach((item, index) => {
        const suggestion = data[index]?.name;
        item.textContent = suggestion || "";
        if (suggestion) {
          item.setAttribute("role", "option");
          item.setAttribute("tabindex", "0");
        } else {
          item.removeAttribute("role");
          item.removeAttribute("tabindex");
        }
      });

      openAutocomplete();
    } catch (error) {
      if (error.name !== "AbortError") closeAutocomplete();
    }
  }

  input.addEventListener("input", () => {
    window.clearTimeout(autocompleteTimer);
    autocompleteTimer = window.setTimeout(() => autocomplete(input.value), 250);
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) openAutocomplete();
  });

  document.querySelectorAll(".auto").forEach((item) => {
    const selectSuggestion = () => {
      if (!item.textContent.trim()) return;
      input.value = item.textContent.trim();
      closeAutocomplete();
      search(input.value);
    };

    item.addEventListener("click", (event) => {
      event.preventDefault();
      selectSuggestion();
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectSuggestion();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (!form.contains(event.target) && !suggestionsMenu?.contains(event.target)) {
      closeAutocomplete();
    }
  });

  window.search = search;
  window.toggleDropdownSearchContent = closeAutocomplete;
  window.displayHidden = () => {
    resultsSection.style.display = "block";
  };
})();
