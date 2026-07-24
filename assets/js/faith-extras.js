/* =========================================================
   Saylavy - features that belong to one faith only

   Muslim: live prayer times with a countdown to the next
   prayer, computed in the browser for the community's own
   city. Times are calculated, so a masjid always replaces
   them with its own published timetable before going live.

   Calculation follows the standard astronomical method
   (ISNA angles by default, switchable per community).
   ========================================================= */
(function () {
  "use strict";

  // GTA communities and their coordinates
  var PLACES = {
    toronto:     { name: "Toronto", lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
    mississauga: { name: "Mississauga", lat: 43.5890, lng: -79.6441, tz: "America/Toronto" },
    brampton:    { name: "Brampton", lat: 43.6832, lng: -79.7629, tz: "America/Toronto" },
    scarborough: { name: "Scarborough", lat: 43.7764, lng: -79.2318, tz: "America/Toronto" },
    markham:     { name: "Markham", lat: 43.8561, lng: -79.3370, tz: "America/Toronto" }
  };

  // ISNA: 15 degrees for both Fajr and Isha (common in North America)
  var METHOD = { fajr: 15, isha: 15 };

  var D2R = Math.PI / 180, R2D = 180 / Math.PI;
  function sin(d) { return Math.sin(d * D2R); }
  function cos(d) { return Math.cos(d * D2R); }
  function tan(d) { return Math.tan(d * D2R); }
  function arcsin(x) { return Math.asin(x) * R2D; }
  function arccos(x) { return Math.acos(x) * R2D; }
  function arccot(x) { return Math.atan(1 / x) * R2D; }
  function fix(a, b) { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; }

  function julian(y, m, d) {
    if (m <= 2) { y -= 1; m += 12; }
    var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
  }
  function sunPosition(jd) {
    var D = jd - 2451545.0;
    var g = fix(357.529 + 0.98560028 * D, 360);
    var q = fix(280.459 + 0.98564736 * D, 360);
    var L = fix(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
    var e = 23.439 - 0.00000036 * D;
    var RA = fix(arctan2(cos(e) * sin(L), cos(L)) / 15, 24);
    return { declination: arcsin(sin(e) * sin(L)), equation: q / 15 - RA };
  }
  function arctan2(y, x) { return Math.atan2(y, x) * R2D; }

  // hour angle for a given sun altitude
  function angleTime(angle, lat, decl) {
    var v = (-sin(angle) - sin(lat) * sin(decl)) / (cos(lat) * cos(decl));
    if (v > 1 || v < -1) return null;                 // sun never reaches it
    return arccos(v) / 15;
  }
  function asrTime(lat, decl) {
    var v = 1 / tan(Math.abs(lat - decl) * D2R === 0 ? 0.0001 : Math.abs(lat - decl));
    var angle = -arccot(1 + Math.abs(tan((lat - decl) * D2R) * 0 + 1 / Math.tan(Math.abs(lat - decl) * D2R)));
    // shadow factor 1 (standard): altitude where shadow equals object length + noon shadow
    var alt = arccot(1 + Math.tan(Math.abs(lat - decl) * D2R));
    var t = angleTime(90 - alt, lat, decl);
    return t;
  }

  function timesFor(date, place) {
    var jd = julian(date.getFullYear(), date.getMonth() + 1, date.getDate());
    var sp = sunPosition(jd);
    var decl = sp.declination, eq = sp.equation;
    var lat = place.lat, lng = place.lng;

    // local timezone offset in hours for that date
    var offMin = -new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12).getTimezoneOffset();
    var tzHours = offMin / 60;

    var dhuhr = 12 - eq - lng / 15 + tzHours;         // solar noon, local clock
    var mk = function (h) { return h === null ? null : h; };

    var sunriseT = angleTime(0.833, lat, decl);
    var fajrT = angleTime(METHOD.fajr, lat, decl);
    var ishaT = angleTime(METHOD.isha, lat, decl);
    var asrT = asrTime(lat, decl);

    return {
      fajr: mk(fajrT === null ? null : dhuhr - fajrT),
      sunrise: mk(sunriseT === null ? null : dhuhr - sunriseT),
      dhuhr: dhuhr + 1 / 60,                           // a minute past true noon
      asr: mk(asrT === null ? null : dhuhr + asrT),
      maghrib: mk(sunriseT === null ? null : dhuhr + sunriseT),
      isha: mk(ishaT === null ? null : dhuhr + ishaT)
    };
  }

  function fmt(h) {
    if (h === null || isNaN(h)) return "--";
    h = fix(h, 24);
    var hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    if (mm === 60) { mm = 0; hh += 1; }
    var ap = hh >= 12 ? "PM" : "AM";
    var h12 = hh % 12; if (h12 === 0) h12 = 12;
    return h12 + ":" + (mm < 10 ? "0" : "") + mm + " " + ap;
  }

  window.SaylavyPrayer = {
    places: PLACES,
    times: timesFor,
    format: fmt,
    // next prayer plus seconds remaining
    next: function (place, now) {
      now = now || new Date();
      var t = timesFor(now, place);
      var order = [
        ["Fajr", t.fajr], ["Sunrise", t.sunrise], ["Dhuhr", t.dhuhr],
        ["Asr", t.asr], ["Maghrib", t.maghrib], ["Isha", t.isha]
      ].filter(function (x) { return x[1] !== null && !isNaN(x[1]); });
      var cur = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
      for (var i = 0; i < order.length; i++) {
        if (order[i][1] > cur) {
          return { name: order[i][0], at: order[i][1], seconds: Math.round((order[i][1] - cur) * 3600) };
        }
      }
      // past Isha: next is tomorrow's Fajr
      var tm = new Date(now.getTime() + 86400000);
      var t2 = timesFor(tm, place);
      return { name: "Fajr", at: t2.fajr, seconds: Math.round((24 - cur + t2.fajr) * 3600), tomorrow: true };
    }
  };
})();
