# Saylavy - Faith path

A free, interactive learning page and QR code for faith communities, powered by [Saylavy.com](https://saylavy.com).

Children scan, listen, interact, and **ask questions out loud** about their faith, and hear a warm, reverent answer back. Every page is approved by the community's own teachers before it goes live.

## What this is

- **A dashboard** (`index.html`) built as a circle of eight faiths. Click a faith to open its page.
- **Eight faith pages**, each with its own colour, symbol, and content:
  - Protestant, Catholic, Orthodox, Muslim, Hindu, Sikh, Jewish, Buddhist
- **A live "Ask and listen" sample** on every faith page. A child types or speaks a question and hears the answer aloud, drawn only from a per-faith, teacher-approved knowledge base.
- **A real, scannable QR code** on the dashboard and each faith page.
- **A partnership call to action** that opens an email to request a free page.

It is a pure front-end static site. No backend, no build step, no API keys. The voice features use the browser's own Speech APIs, so nothing is sent anywhere.

## Sensitivity

Content follows a per-faith framework so nothing crosses a line. The answering voice is always a warm **teacher or guide**, never God, a prophet, or a deity. Islam pages are audio-first with no music and no depiction of Allah, the Prophet, or any prophet. No images of God on Jewish or Sikh pages. The word "idol" is never used. Icons are "venerated," not worshipped. See `Saylavy Chruches/Multi_Faith_Content_Framework.md` for the full rulebook.

## Run locally

Any static server works. For example:

```
cd "Saylavy-religion-website"
python3 -m http.server 8080
# open http://localhost:8080
```

Open in Chrome, Safari, or Edge to hear the voices. Voice input (the microphone) needs Chrome or Edge.

## Deploy (GitHub Pages)

1. Push to `main` on `EugenAzxa/Saylavy-religion-`.
2. In the repo, go to **Settings -> Pages**, set **Source: Deploy from a branch**, **Branch: main / root**, and save.
3. The site publishes at `https://eugenazxa.github.io/Saylavy-religion-/`.

The QR codes encode the live page URL automatically once hosted, so a printed code opens the real page.

## Files

```
index.html              Dashboard - the circle of eight
protestant.html ...     One page per faith (8 total)
assets/css/style.css    Design system + 8 faith colour themes
assets/js/faith-data.js Content, symbols, colours, per-faith Q&A
assets/js/faith.js      Renders a faith page + the ask/listen engine
assets/js/main.js       Header, nav, reveal, the circle selector
assets/js/qr.js         Renders real QR codes
assets/js/qrcode.min.js QR library (MIT, davidshimjs/qrcodejs)
assets/img/favicon.svg  Favicon
```

## To adjust content

All copy, colours, and answers live in `assets/js/faith-data.js`. Edit one faith object to change its story cards, its guide, its suggested questions, and the Q&A the sample answers from.

Made with reverence for every faith. Scan, listen, interact, learn.
