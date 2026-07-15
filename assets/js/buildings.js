/* =========================================================
   Saylavy - houses of worship (animated SVG scenes)
   One stylised, non-figurative building per faith. Filled in
   the faith accent (currentColor), lit windows glow warm.
   No depiction of God, prophets, or people anywhere.
   ========================================================= */
(function () {
  "use strict";

  // shared sky extras (clouds + birds) added around every building
  var SKY =
    '<g class="jclouds" aria-hidden="true">' +
      '<ellipse class="jcloud c1" cx="52" cy="40" rx="20" ry="7"/>' +
      '<ellipse class="jcloud c2" cx="196" cy="30" rx="16" ry="6"/>' +
    '</g>' +
    '<g class="jbirds" aria-hidden="true">' +
      '<path class="jbird b1" d="M0 0 q4 -4 8 0 q4 -4 8 0"/>' +
      '<path class="jbird b2" d="M0 0 q3 -3 6 0 q3 -3 6 0"/>' +
    '</g>';

  var ground = '<rect class="jground" x="28" y="168" width="184" height="9" rx="4"/>';
  var halo = function (cx, cy, r) { return '<circle class="jhalo" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>'; };

  var B = {};

  // ---- Protestant: gabled church + steeple + cross ----
  B.protestant =
    halo(120, 64, 50) + SKY +
    '<g fill="currentColor">' +
      '<rect x="96" y="104" width="96" height="64" rx="3"/>' +
      '<polygon points="90,106 198,106 144,70"/>' +
      '<rect x="60" y="90" width="28" height="78" rx="3"/>' +
      '<polygon points="55,92 93,92 74,52"/>' +
      '<rect x="71" y="28" width="6" height="24" rx="2"/><rect x="64" y="35" width="20" height="6" rx="2"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<rect x="112" y="120" width="16" height="24" rx="8"/>' +
      '<rect x="160" y="120" width="16" height="24" rx="8"/>' +
      '<rect x="66" y="108" width="16" height="20" rx="7"/>' +
      '<rect x="134" y="140" width="20" height="28" rx="10"/>' +
    '</g>' + ground;

  // ---- Catholic: cathedral, twin towers, rose window ----
  B.catholic =
    halo(120, 58, 54) + SKY +
    '<g fill="currentColor">' +
      '<rect x="88" y="96" width="64" height="72" rx="3"/>' +
      '<polygon points="84,98 156,98 120,66"/>' +
      '<rect x="58" y="82" width="26" height="86" rx="3"/>' +
      '<rect x="156" y="82" width="26" height="86" rx="3"/>' +
      '<polygon points="55,84 87,84 71,56"/>' +
      '<polygon points="153,84 185,84 169,56"/>' +
      '<rect x="68" y="38" width="6" height="18" rx="2"/><rect x="63" y="43" width="16" height="5" rx="2"/>' +
      '<rect x="166" y="38" width="6" height="18" rx="2"/><rect x="161" y="43" width="16" height="5" rx="2"/>' +
      '<rect x="117" y="40" width="6" height="26" rx="2"/><rect x="110" y="48" width="20" height="6" rx="2"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<circle cx="120" cy="112" r="9"/>' +
      '<rect x="104" y="132" width="32" height="36" rx="16"/>' +
      '<rect x="65" y="104" width="12" height="20" rx="6"/>' +
      '<rect x="163" y="104" width="12" height="20" rx="6"/>' +
    '</g>' + ground;

  // ---- Orthodox: onion domes + three-bar crosses ----
  B.orthodox =
    halo(120, 60, 54) + SKY +
    '<g fill="currentColor">' +
      '<rect x="82" y="110" width="76" height="58" rx="3"/>' +
      '<rect x="112" y="74" width="16" height="30"/>' +
      '<rect x="88" y="90" width="12" height="20"/>' +
      '<rect x="140" y="90" width="12" height="20"/>' +
      '<path d="M108 76 q12 -30 24 0 q-4 8 -12 8 q-8 0 -12 -8z"/>' +
      '<path d="M85 92 q9 -22 18 0 q-3 6 -9 6 q-6 0 -9 -6z"/>' +
      '<path d="M137 92 q9 -22 18 0 q-3 6 -9 6 q-6 0 -9 -6z"/>' +
      '<rect x="118" y="40" width="4" height="30"/><rect x="111" y="48" width="18" height="4"/><rect x="114" y="60" width="12" height="3"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<rect x="112" y="132" width="16" height="36" rx="8"/>' +
      '<rect x="92" y="124" width="12" height="20" rx="6"/>' +
      '<rect x="136" y="124" width="12" height="20" rx="6"/>' +
    '</g>' + ground;

  // ---- Muslim: masjid dome + minarets + crescent (no figures) ----
  B.muslim =
    halo(120, 58, 54) + SKY +
    '<g fill="currentColor">' +
      '<rect x="86" y="106" width="68" height="62" rx="4"/>' +
      '<path d="M86 106 q34 -48 68 0z"/>' +
      '<path d="M120 48 a11 11 0 1 0 7 13 a8.5 8.5 0 1 1 -7 -13z"/>' +
      '<rect x="60" y="84" width="12" height="84" rx="3"/>' +
      '<rect x="168" y="84" width="12" height="84" rx="3"/>' +
      '<path d="M59 86 q7 -20 14 0z"/><path d="M167 86 q7 -20 14 0z"/>' +
      '<rect x="63" y="58" width="6" height="10"/><rect x="171" y="58" width="6" height="10"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<path d="M111 138 q9 -24 18 0 v30 h-18z"/>' +
      '<path d="M93 128 q5 -15 10 0 v16 h-10z"/>' +
      '<path d="M137 128 q5 -15 10 0 v16 h-10z"/>' +
    '</g>' + ground;

  // ---- Hindu: mandir shikhara tower + kalash ----
  B.hindu =
    halo(120, 56, 54) + SKY +
    '<g fill="currentColor">' +
      '<rect x="84" y="122" width="72" height="46" rx="3"/>' +
      '<path d="M92 122 q28 -84 56 0z"/>' +
      '<circle cx="120" cy="40" r="5"/><rect x="118" y="30" width="4" height="10"/>' +
    '</g>' +
    '<g class="jband">' +
      '<rect x="97" y="104" width="46" height="4" rx="2"/>' +
      '<rect x="94" y="118" width="52" height="4" rx="2"/>' +
      '<rect x="101" y="90" width="38" height="4" rx="2"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<path d="M112 138 q8 -18 16 0 v30 h-16z"/>' +
    '</g>' + ground;

  // ---- Sikh: gurdwara dome + Nishan Sahib flag + khanda finial ----
  B.sikh =
    halo(126, 60, 52) + SKY +
    '<g fill="currentColor">' +
      '<rect x="92" y="108" width="72" height="60" rx="3"/>' +
      '<path d="M92 108 q36 -42 72 0z"/>' +
      '<rect x="122" y="66" width="12" height="14"/>' +
      '<circle cx="128" cy="54" r="5"/><rect x="126" y="40" width="4" height="14"/>' +
      '<path d="M96 110 q8 -16 16 0z"/><path d="M144 110 q8 -16 16 0z"/>' +
      '<rect x="58" y="66" width="4" height="102"/>' +
      '<path d="M62 70 l28 9 l-28 9z"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<rect x="120" y="132" width="16" height="36" rx="8"/>' +
      '<rect x="100" y="124" width="12" height="18" rx="6"/>' +
      '<rect x="146" y="124" width="12" height="18" rx="6"/>' +
    '</g>' + ground;

  // ---- Jewish: synagogue + Star of David ----
  B.jewish =
    halo(120, 58, 52) + SKY +
    '<g fill="currentColor">' +
      '<rect x="86" y="100" width="68" height="68" rx="3"/>' +
      '<polygon points="80,102 160,102 120,70"/>' +
      '<path d="M120 30 l9 15 h-18z"/><path d="M120 52 l9 -15 h-18z"/>' +
    '</g>' +
    '<g class="jwin">' +
      '<rect x="108" y="88" width="10" height="14" rx="5"/><rect x="122" y="88" width="10" height="14" rx="5"/>' +
      '<rect x="110" y="130" width="20" height="38" rx="10"/>' +
      '<rect x="92" y="120" width="12" height="20" rx="6"/>' +
      '<rect x="136" y="120" width="12" height="20" rx="6"/>' +
    '</g>' + ground;

  // ---- Buddhist: pagoda tiers + dharma wheel finial ----
  B.buddhist =
    halo(120, 56, 52) + SKY +
    '<g fill="currentColor">' +
      '<rect x="98" y="130" width="44" height="38" rx="3"/>' +
      '<path d="M82 130 h76 l-13 -16 h-50z"/>' +
      '<path d="M88 114 h64 l-12 -16 h-40z"/>' +
      '<path d="M94 98 h52 l-11 -16 h-30z"/>' +
      '<rect x="118" y="74" width="4" height="10"/>' +
    '</g>' +
    '<g class="jwheel"><circle cx="120" cy="64" r="8"/>' +
      '<line x1="120" y1="56" x2="120" y2="72"/><line x1="112" y1="64" x2="128" y2="64"/>' +
      '<line x1="114.5" y1="58.5" x2="125.5" y2="69.5"/><line x1="125.5" y1="58.5" x2="114.5" y2="69.5"/></g>' +
    '<g class="jwin">' +
      '<rect x="112" y="142" width="18" height="26" rx="9"/>' +
    '</g>' + ground;

  if (typeof window !== "undefined") window.BUILDINGS = B;
})();
