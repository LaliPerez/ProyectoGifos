// Theme management shared by all pages.
(() => {
  const body = document.getElementById("theme");
  const dayButton = document.getElementById("day");
  const nightButton = document.getElementById("night");
  const menuButton = document.getElementById("themeMenuButton");
  const menuArrow = document.getElementById("themeMenuArrow");
  const menu = document.getElementById("themeDropdownContent");

  if (!body) return;

  function setTheme(theme) {
    body.className = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.style.colorScheme = theme === "night" ? "dark" : "light";
  }

  function toggleMenu(force) {
    if (!menu) return;
    const open = typeof force === "boolean" ? force : menu.style.display !== "block";
    menu.style.display = open ? "block" : "none";
    menuButton?.setAttribute("aria-expanded", String(open));
  }

  const savedTheme = localStorage.getItem("theme");
  setTheme(savedTheme === "night" ? "night" : "day");
  dayButton?.addEventListener("click", () => setTheme("day"));
  nightButton?.addEventListener("click", () => setTheme("night"));
  menuButton?.addEventListener("click", () => toggleMenu());
  menuArrow?.addEventListener("click", () => toggleMenu());
  document.addEventListener("click", (event) => {
    if (menu && !event.target.closest("#dropdown") && menu.style.display === "block") toggleMenu(false);
  });
})();
