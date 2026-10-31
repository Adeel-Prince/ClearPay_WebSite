/* Filterable features: category buttons + live text search. */
(function () {
  "use strict";
  var list = document.getElementById("feature-list");
  if (!list) return;

  var items = Array.prototype.slice.call(list.children);
  var buttons = Array.prototype.slice.call(
    document.querySelectorAll("[data-filter]"),
  );
  var search = document.getElementById("feature-search");
  var count = document.getElementById("feature-count");
  var empty = document.getElementById("feature-empty");
  var state = { category: "all", query: "" };

  var text = items.map(function (li) {
    return li.textContent.toLowerCase();
  });

  function apply() {
    var shown = 0;
    items.forEach(function (li, i) {
      var okCat =
        state.category === "all" ||
        li.getAttribute("data-category") === state.category;
      var okText = !state.query || text[i].indexOf(state.query) !== -1;
      var visible = okCat && okText;
      li.hidden = !visible;
      if (visible) shown++;
    });
    count.textContent =
      "Showing " + shown + " of " + items.length + " features";
    empty.hidden = shown !== 0;
  }

  function setCategory(cat) {
    state.category = cat;
    buttons.forEach(function (b) {
      b.setAttribute(
        "aria-pressed",
        String(b.getAttribute("data-filter") === cat),
      );
    });
    apply();
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      setCategory(b.getAttribute("data-filter"));
    });
  });
  search.addEventListener("input", function () {
    state.query = search.value.trim().toLowerCase();
    apply();
  });
  document
    .getElementById("feature-reset")
    .addEventListener("click", function () {
      search.value = "";
      state.query = "";
      setCategory("all");
      search.focus();
    });

  // links such as features.html#security open with that filter selected
  var hash = location.hash.replace("#", "");
  var valid = buttons.some(function (b) {
    return b.getAttribute("data-filter") === hash;
  });
  setCategory(valid ? hash : "all");

  // clicking a link like features.html#analytics while already on this page
  window.addEventListener("hashchange", function () {
    var h = location.hash.replace("#", "");
    if (
      buttons.some(function (b) {
        return b.getAttribute("data-filter") === h;
      })
    )
      setCategory(h);
  });
})();
