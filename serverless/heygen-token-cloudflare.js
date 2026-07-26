/* LiveAvatar (HeyGen) session-token endpoint - Cloudflare Worker
   --------------------------------------------------------------
   HeyGen retired the old /v1/streaming.* API; this uses the new
   LiveAvatar API (https://api.liveavatar.com/v1/sessions/token).
   The website POSTs { mode, avatar_id }; this adds the secret key.

   Deploy:
   1. dash.cloudflare.com -> Workers & Pages -> your Worker -> Edit code
   2. Paste this whole file, Deploy.
   3. Settings -> Variables and Secrets -> Secret
        HEYGEN_API_KEY = <your HeyGen API key>
   4. Deploy again.
*/
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    let body = {};
    try { body = await request.json(); } catch (e) {}
    const payload = {
      mode: body.mode || "FULL",
      avatar_id: body.avatar_id || null,
    };

    try {
      const r = await fetch("https://api.liveavatar.com/v1/sessions/token", {
        method: "POST",
        headers: { "X-API-KEY": env.HEYGEN_API_KEY, "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      const token = data && data.data && data.data.session_token;
      return new Response(JSON.stringify({
        token: token || null,
        sessionId: (data && data.data && data.data.session_id) || null,
        keyPresent: Boolean(env.HEYGEN_API_KEY),
        status: r.status,
        raw: token ? undefined : data,   // shows the real error when no token
      }), { headers: { ...cors, "content-type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ token: null, error: String(e) }), {
        status: 500, headers: { ...cors, "content-type": "application/json" },
      });
    }
  },
};
