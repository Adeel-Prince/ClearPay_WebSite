/* Theme toggle with localStorage persistence.
   The saved theme is applied before first paint by a tiny inline script in each page's <head>
   (so there is no flash of the wrong theme). This file handles the toggle button. */
(function () {
  "use strict";
  var KEY = "clearpay-theme";
  var root = document.documentElement;
  var btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
    );
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute("content", theme === "dark" ? "#0a0f1f" : "#ffffff");
  }
  function save(theme) {
    try {
      localStorage.setItem(KEY, theme);
    } catch (e) {
      /* storage blocked: theme still works for this visit */
    }
  }

  apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(next);
    save(next);
  });

  // keep other open tabs/pages in sync
  window.addEventListener("storage", function (e) {
    if (e.key === KEY && (e.newValue === "dark" || e.newValue === "light"))
      apply(e.newValue);
  });
})();
