/**
 * Loaded only from `instrumentation.ts` when `NEXT_RUNTIME === "nodejs"`.
 * Keeps Node-only APIs out of the Edge bundle graph for `instrumentation.ts`.
 */

// #region agent log
fetch("http://127.0.0.1:7914/ingest/98639d74-29b2-4c0b-adaf-408d11f2412b", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Debug-Session-Id": "316ce9",
  },
  body: JSON.stringify({
    sessionId: "316ce9",
    runId: "dev-server-boot",
    hypothesisId: "H1",
    location: "instrumentation-node.ts",
    message: "Next Node instrumentation register fired (nodejs chunk)",
    data: {
      pid: process.pid,
      cwd: process.cwd(),
      nodeEnv: process.env.NODE_ENV,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion

export {};
