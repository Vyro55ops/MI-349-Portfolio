/* ==========================================================================
   Dark/light mode toggle
   Loaded in <head> so the saved theme is applied before the page paints
   (no flash of the wrong colors). The colors themselves live in
   css/styles.css under :root and :root[data-theme="light"].
   ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  // Some browsers block localStorage (private mode, strict privacy
  // settings), so every read and write is wrapped in try/catch.
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Not saved; the toggle still works for this visit.
    }
  }

  // A saved choice wins. Otherwise follow the device setting, and fall
  // back to dark, the site's original look.
  function getStartingTheme() {
    var saved = getSavedTheme();
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return "light";
    }
    return "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);

    // Match the browser toolbar color on phones
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", theme === "light" ? "#f3efe2" : "#0d1321");
    }

    updateButton(theme);
  }

  // The button says what it will switch to: "Light mode" while dark,
  // "Dark mode" while light.
  function updateButton(theme) {
    var button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }
    var nextIsLight = theme === "dark";
    button.querySelector("span").textContent = nextIsLight ? "☀" : "☾";
    button.lastChild.textContent = nextIsLight ? "Light mode" : "Dark mode";
  }

  // The button is built here rather than written in the HTML, so visitors
  // without JavaScript never see a control that does nothing.
  function createButton() {
    var header = document.querySelector("header");
    if (!header) {
      return;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.id = "theme-toggle";

    var icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    button.appendChild(icon);
    button.appendChild(document.createTextNode(""));

    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      saveTheme(next);
    });

    // After the nav, so the Tab order matches what you see on screen
    header.appendChild(button);
    updateButton(root.getAttribute("data-theme"));
  }

  // Runs immediately, before the page paints
  applyTheme(getStartingTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createButton);
  } else {
    createButton();
  }

  // If the visitor never picked a theme, keep following their device
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function (event) {
      if (!getSavedTheme()) {
        applyTheme(event.matches ? "light" : "dark");
      }
    });
  }
})();
