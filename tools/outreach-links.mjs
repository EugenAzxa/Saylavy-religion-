/* =========================================================
   Saylavy - build the outreach link sheet

   Reads the GTA target list and produces, for every community,
   a personalised demo link that opens THEIR faith's page and
   greets them by name. Output is a CSV you can paste into a
   mail merge or work through by hand.

   Usage:
     node tools/outreach-links.mjs                       # local preview links
     BASE=https://eugenazxa.github.io/Saylavy-religion-website node tools/outreach-links.mjs
   ========================================================= */
import fs from "node:fs";
import path from "node:path";

const HERE = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const ROOT = path.resolve(HERE, "..");
const LIST = path.resolve(ROOT, "..", "Saylavy Chruches ", "GTA_All_Faiths_Target_List.md");
const BASE = (process.env.BASE || "http://localhost:8199").replace(/\/+$/, "");

// map a heading in the list to the faith page it should open
const SECTIONS = [
  [/evangelical|protestant/i, "protestant"],
  [/catholic/i, "catholic"],
  [/orthodox/i, "orthodox"],
  [/muslim|mosque|islamic/i, "muslim"],
  [/hindu|mandir/i, "hindu"],
  [/sikh|gurdwara/i, "sikh"],
  [/jewish|synagogue/i, "jewish"],
  [/buddhist|temple/i, "buddhist"],
];

if (!fs.existsSync(LIST)) {
  console.error("Target list not found at:\n  " + LIST);
  process.exit(1);
}

const rows = [];
let faith = null;
for (const line of fs.readFileSync(LIST, "utf8").split("\n")) {
  const h = line.match(/^##\s+(.*)$/);
  if (h) {
    const title = h[1];
    const hit = SECTIONS.find(([re]) => re.test(title));
    faith = hit ? hit[1] : null;
    continue;
  }
  if (!faith || !line.startsWith("|")) continue;
  const cells = line.split("|").map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
  if (cells.length < 2) continue;
  const place = cells[0];
  if (!place || /^-+$/.test(place) || /^place$/i.test(place)) continue;
  const area = cells[1] || "";
  const email = (cells[3] || cells[cells.length - 1] || "").replace(/\(via[^)]*\)/i, "").trim();
  // strip markdown emphasis from the name
  const clean = place.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  rows.push({
    faith, place: clean, area,
    email: /@/.test(email) ? email : "",
    link: `${BASE}/${faith}.html?for=${encodeURIComponent(clean)}`,
  });
}

const esc = s => `"${String(s).replace(/"/g, '""')}"`;
const csv = ["faith,place,area,email,personalised_link"]
  .concat(rows.map(r => [r.faith, r.place, r.area, r.email, r.link].map(esc).join(",")))
  .join("\n");

const out = path.join(ROOT, "outreach-links.csv");
fs.writeFileSync(out, csv + "\n");

const byFaith = rows.reduce((m, r) => (m[r.faith] = (m[r.faith] || 0) + 1, m), {});
console.log(`${rows.length} communities across ${Object.keys(byFaith).length} faiths`);
console.log(byFaith);
console.log(`with email on file: ${rows.filter(r => r.email).length}`);
console.log(`\nwritten to ${path.relative(ROOT, out)}`);
console.log(`example: ${rows[0] && rows[0].link}`);
