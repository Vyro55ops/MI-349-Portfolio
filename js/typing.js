/* ==========================================================================
   Typewriter headline with Typed.js (https://github.com/mattboldt/typed.js)
   Typed.js itself loads from the cdnjs CDN in index.html. This file types
   the intro headline out letter by letter, like an old arcade terminal.
   ========================================================================== */

(function () {
  "use strict";

  // If the CDN didn't load, do nothing: the headline is already on the page
  if (typeof Typed !== "function") {
    return;
  }

  // Respect people who turn off motion: show the headline as-is
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  var heading = document.querySelector("#intro h1");
  if (!heading) {
    return;
  }

  var text = heading.textContent.trim();

  // Screen readers get the whole headline at once, never half-typed words
  heading.setAttribute("aria-label", text);

  // An invisible copy holds the headline's full size, and the typing
  // happens in a second span laid over it (see css/styles.css).
  // Typed.js adds its cursor right after the typed text, so both live
  // inside the overlay.
  var placeholder = document.createElement("span");
  placeholder.setAttribute("aria-hidden", "true");
  placeholder.textContent = text;

  var overlay = document.createElement("span");
  overlay.setAttribute("aria-hidden", "true");

  var typed = document.createElement("span");
  overlay.appendChild(typed);

  heading.textContent = "";
  heading.appendChild(placeholder);
  heading.appendChild(overlay);
  heading.setAttribute("data-typing", "");

  new Typed(typed, {
    strings: [text],
    typeSpeed: 35,
    startDelay: 400,
    cursorChar: "_",
    autoInsertCss: false,  // the cursor is styled in css/styles.css instead
    loop: false,
    onComplete: function (self) {
      // Stop the cursor blinking a few seconds after typing finishes
      // (WCAG 2.2.2: nothing should blink for more than 5 seconds)
      window.setTimeout(function () {
        if (self.cursor) {
          self.cursor.remove();
        }
      }, 3000);
    }
  });
})();
