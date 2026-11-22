// Trending GIFs
(() => {
  const API_KEY = "9pB6HDoUsmugUZYZ3Hi26eSUUS1KDe6M";
  const container = document.getElementById("trendsContainer");
  if (!container) return;

  async function trending() {
    container.setAttribute("aria-busy", "true");
    try {
      const params = new URLSearchParams({ api_key: API_KEY, limit: "18", rating: "g" });
      const response = await fetch(`https://api.giphy.com/v1/gifs/trending?${params}`);
      if (!response.ok) throw new Error(`Giphy respondió con ${response.status}`);
      const payload = await response.json();

      container.innerHTML = "";
      const fragment = document.createDocumentFragment();
      (payload.data || []).forEach((item) => {
        const card = document.createElement("article");
        card.className = "contenedorInternoT";

        const image = document.createElement("img");
        image.className = "gifTrend";
        image.src = item.images?.fixed_height?.url || item.images?.original?.url;
        image.alt = item.title || "GIF en tendencia";
        image.loading = "lazy";

        const title = document.createElement("p");
        title.className = "item2";
        title.textContent = item.title ? `#${item.title}` : "#Tendencias";

        card.append(image, title);
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
    } catch (error) {
      container.innerHTML = "";
      const status = document.createElement("p");
      status.className = "searchStatus";
      status.textContent = "No se pudieron cargar las tendencias.";
      container.appendChild(status);
      console.error("Error al cargar tendencias:", error);
    } finally {
      container.removeAttribute("aria-busy");
    }
  }

  trending();
})();
