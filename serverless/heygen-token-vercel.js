/* HeyGen session-token endpoint - Vercel serverless function
   ----------------------------------------------------------
   Deploy:
   1. Put this file at  api/heygen-token.js  in a Vercel project.
   2. Vercel -> Settings -> Environment Variables:
        HEYGEN_API_KEY = <your HeyGen API key>
   3. Deploy. Your endpoint is  https://<project>.vercel.app/api/heygen-token
   4. Put that URL into avatar-data.js -> heygen.tokenEndpoint
   (Netlify is nearly identical: place at netlify/functions/heygen-token.js
    and export a handler; ask me and I'll give the exact wrapper.)
*/
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  try {
    const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
      method: "POST",
      headers: { "x-api-key": process.env.HEYGEN_API_KEY, "content-type": "application/json" },
    });
    const data = await r.json();
    return res.status(200).json({ token: (data && data.data && data.data.token) || null });
  } catch (e) {
    return res.status(500).json({ token: null, error: String(e) });
  }
}
