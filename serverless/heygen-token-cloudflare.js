/* HeyGen session-token endpoint - Cloudflare Worker (simplest, free)
   ------------------------------------------------------------------
   Deploy:
   1. https://dash.cloudflare.com -> Workers & Pages -> Create -> Worker
   2. Paste this whole file, Deploy. You get a URL like
      https://saylavy-heygen.<you>.workers.dev
   3. Worker -> Settings -> Variables -> add a SECRET:
        Name:  HEYGEN_API_KEY
        Value: <your HeyGen API key>   (Settings -> API in HeyGen)
   4. Put that Worker URL into avatar-data.js -> heygen.tokenEndpoint
   The API key lives only here, never in the website.
*/
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    try {
      const r = await fetch("https://api.heygen.com/v1/streaming.create_token", {
        method: "POST",
        headers: { "x-api-key": env.HEYGEN_API_KEY, "content-type": "application/json" },
      });
      const data = await r.json();
      const token = data && data.data && data.data.token;
      return new Response(JSON.stringify({
        token: token || null,
        keyPresent: Boolean(env.HEYGEN_API_KEY),
        heygenStatus: r.status,
        heygen: token ? undefined : data,
      }), { headers: { ...cors, "content-type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ token: null, error: String(e) }), {
        status: 500, headers: { ...cors, "content-type": "application/json" },
      });
    }
  },
};
