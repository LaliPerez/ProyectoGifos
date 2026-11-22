// Suggested GIFs
(() => {
  const API_KEY = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
  const container = document.getElementById("showSugerencias");
  if (!container) return;

  const terms = ["lol", "simpsons", "dog", "smile", "modern family", "netflix", "cute", "koala", "animals", "joke"];
  const term = terms[Math.floor(Math.random() * terms.length)];

  async function loadSuggestions() {
    container.setAttribute("aria-busy", "true");
    try {
      const params = new URLSearchParams({ api_key: API_KEY, q: term, limit: "4", rating: "g" });
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?${params}`);
      if (!response.ok) throw new Error(`Giphy respondió con ${response.status}`);
      const payload = await response.json();
      container.innerHTML = "";

      (payload.data || []).forEach((item) => {
        const card = document.createElement("article");
        card.className = "contenedorInternoSug";

        const title = document.createElement("h3");
        title.className = "item3";
        title.textContent = item.title ? `#${item.title}` : `#${term}`;

        const image = document.createElement("img");
        image.className = "gifSug";
        image.src = item.images?.fixed_height?.url || item.images?.original?.url;
        image.alt = item.title || `GIF de ${term}`;
        image.loading = "lazy";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "btnSeeMore";
        button.textContent = "Ver más";
        button.addEventListener("click", () => {
          if (typeof window.search === "function") window.search(term);
        });

        card.append(title, image, button);
        container.appendChild(card);
      });
    } catch (error) {
      container.textContent = "No se pudieron cargar las sugerencias.";
      console.error("Error al cargar sugerencias:", error);
    } finally {
      container.removeAttribute("aria-busy");
    }
  }

  loadSuggestions();
})();
