/* =========================================================
   Saylavy - pre-generate real voice clips (run once, offline)

   Why this is the best option:
   - genuinely human voices in the demo
   - no API key in the browser, so nothing can be stolen or abused
   - no cost or network call when a visitor uses the site
   - works even with no internet during a pitch

   Usage:
     ELEVEN_KEY=your_key node tools/generate-voices.mjs          # everything
     ELEVEN_KEY=your_key node tools/generate-voices.mjs greetings # just greetings

   It writes MP3s into assets/audio/ and a map into
   assets/js/voice-clips.js, which the site already loads.
   ========================================================= */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const KEY = process.env.ELEVEN_KEY || "";
const MODEL = process.env.ELEVEN_MODEL || "eleven_turbo_v2_5";
const SCOPE = (process.argv[2] || "all").toLowerCase();
const ROOT = path.resolve(path.dirname(decodeURIComponent(new URL(import.meta.url).pathname)), "..");
const AUDIO = path.join(ROOT, "assets", "audio");

if (!KEY) { console.error("Set ELEVEN_KEY first, e.g. ELEVEN_KEY=sk_... node tools/generate-voices.mjs"); process.exit(1); }

// default voice ids (override with your own cloned voices for a real teacher)
// a pool per gender so different speakers sound like different people
const POOL = {
  female: ["21m00Tcm4TlvDq8ikWAM", "EXAVITQu4vr4xnSDxMaL", "MF3mGyEYCl7XYWbV9V6O", "AZnzlk1XvdvUeBnXmlld"],
  male: ["pNInz6obpgDQGcFmaJgB", "ErXwobaYiN019PkySvjV", "TxGEqnHWrfWFTfGW9XjX", "VR6AewLTigWG4xSOukaG", "yoZ06aMxZJJ28mfd3POQ"],
};
// stable per-speaker choice so a speaker always sounds the same
function voiceFor(gender, speaker) {
  const pool = POOL[gender] || POOL.female;
  let h = 0;
  for (let i = 0; i < speaker.length; i++) h = (h * 31 + speaker.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

// load the site data exactly as the browser does
const files = ["faith-data.js", "faith-people.js", "faith-learn.js", "faith-icons.js"]
  .map(f => fs.readFileSync(path.join(ROOT, "assets", "js", f), "utf8")).join("\n");
const ctx = { window: {}, console };
vm.createContext(ctx);
vm.runInContext(files + "\nwindow.__F = FAITHS; window.__ORDER = FAITH_ORDER;", ctx);
const FAITHS = ctx.window.__F, ORDER = ctx.window.__ORDER;

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
const jobs = [];
const addJob = (key, text, gender, name, speaker) => jobs.push({ key, text, gender, name, speaker: speaker || name });

for (const k of ORDER) {
  const f = FAITHS[k];
  const gg = f.guide.g === "m" ? "male" : "female";
  addJob(`${f.guide.name}::${f.greeting}`, f.greeting, gg, `${k}-guide-greeting`, f.guide.name);
  if (SCOPE === "all") {
    f.qa.forEach((qa, i) => addJob(`${f.guide.name}::${qa.a}`, qa.a, gg, `${k}-guide-a${i}`, f.guide.name));
    (f.learn || []).forEach((c, i) => {
      const t = (c.original ? c.original + ". " : "") + c.body;
      addJob(t, t, gg, `${k}-lesson${i}`, f.guide.name);
    });
  }
  (f.people || []).forEach((p, pi) => {
    const g = (p.voice && p.voice.g) === "m" ? "male" : "female";
    addJob(`${p.name}::${p.greeting}`, p.greeting, g, `${k}-${slug(p.name)}-greeting`, p.name);
    const story = p.bio + " " + p.quote;
    addJob(`${p.name}::${story}`, story, g, `${k}-${slug(p.name)}-story`, p.name);
    if (SCOPE === "all") p.qa.forEach((qa, i) => addJob(`${p.name}::${qa.a}`, qa.a, g, `${k}-${slug(p.name)}-a${i}`, p.name));
  });
}

fs.mkdirSync(AUDIO, { recursive: true });
const clipsPath = path.join(ROOT, "assets", "js", "voice-clips.js");
let existing = {};
try {
  const c = { window: {} }; vm.createContext(c);
  vm.runInContext(fs.readFileSync(clipsPath, "utf8"), c);
  existing = c.window.VOICE_CLIPS || {};
} catch { /* first run */ }

const totalChars = jobs.reduce((n, j) => n + j.text.length, 0);
console.log(`${jobs.length} clips, about ${totalChars.toLocaleString()} characters (${SCOPE})`);

let made = 0, skipped = 0, failed = 0;
for (const j of jobs) {
  const file = path.join(AUDIO, j.name + ".mp3");
  const rel = "assets/audio/" + j.name + ".mp3";
  if (fs.existsSync(file) && existing[j.key]) { skipped++; continue; }
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceFor(j.gender, j.speaker)}`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({
        text: j.text, model_id: MODEL,
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.25, use_speaker_boost: true }
      })
    });
    if (!r.ok) { console.error(`  fail ${j.name}: ${r.status} ${(await r.text()).slice(0, 120)}`); failed++; continue; }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    existing[j.key] = rel;
    made++;
    if (made % 10 === 0) console.log(`  ${made} generated...`);
    await new Promise(res => setTimeout(res, 120));   // stay polite to the API
  } catch (e) { console.error(`  error ${j.name}: ${e.message}`); failed++; }
}

fs.writeFileSync(clipsPath,
  "/* Auto-generated by tools/generate-voices.mjs - real recorded voice clips.\n" +
  "   The site plays these instead of the browser voice. Safe to commit: no keys. */\n" +
  "window.VOICE_CLIPS = " + JSON.stringify(existing, null, 2) + ";\n");

console.log(`\ndone: ${made} generated, ${skipped} already present, ${failed} failed`);
console.log(`map written to assets/js/voice-clips.js (${Object.keys(existing).length} clips)`);
