# HeyGen token endpoint

The live avatar needs a short-lived **session token**, minted from your
HeyGen **API key**. The key must never sit in the website, so this tiny
function holds it and returns only a token. Deploy ONE of these (all free):

- **Cloudflare Worker** - `heygen-token-cloudflare.js` (easiest, one file)
- **Vercel** - `heygen-token-vercel.js` -> place at `api/heygen-token.js`

## Steps
1. Get your HeyGen **API key**: HeyGen -> Settings -> API.
2. Deploy the function and set the secret/env var **`HEYGEN_API_KEY`** to that key.
3. Copy the function's public URL.
4. Paste that URL into `assets/js/avatar-data.js` -> `heygen.tokenEndpoint`.
5. Open the Muslim page -> "Meet your teacher" -> **Live avatar** tab.

The website only ever calls your endpoint; the API key stays on the server.

Need Netlify, AWS, or something else? Ask and I'll give you that exact wrapper.
