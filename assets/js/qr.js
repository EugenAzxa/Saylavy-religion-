/* =========================================================
   Saylavy - QR rendering
   Renders a real, scannable QR for any element with [data-qr].
   The QR encodes the live URL of the target page, so once the
   site is on GitHub Pages the code opens the real page.
   Falls back to the expected Pages URL during local file preview.
   ========================================================= */
(function () {
  "use strict";
  var FALLBACK_BASE = "https://eugenazxa.github.io/Saylavy-religion-website/";

  function urlFor(page) {
    page = page || "";
    if (location.protocol === "http:" || location.protocol === "https:") {
      try { return new URL(page, location.href).href.split("#")[0]; }
      catch (e) { return location.href.split("#")[0]; }
    }
    // file:// preview: fall back to this page's own filename when none given
    if (!page) {
      var f = (location.pathname.split("/").pop() || "index.html");
      page = /\.html?$/i.test(f) ? f : "index.html";
    }
    return FALLBACK_BASE + page;
  }

  function render() {
    if (typeof QRCode === "undefined") return;
    document.querySelectorAll("[data-qr]").forEach(function (elm) {
      if (elm.dataset.qrDone) return;
      elm.dataset.qrDone = "1";
      var size = parseInt(elm.getAttribute("data-size") || "160", 10);
      elm.setAttribute("role", "img");
      elm.setAttribute("aria-label", "QR code that opens this page");
      /* eslint-disable no-new */
      new QRCode(elm, {
        text: urlFor(elm.getAttribute("data-qr")),
        width: size, height: size,
        colorDark: "#211d18", colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
    });
  }

  window.SaylavyQR = render;
  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
