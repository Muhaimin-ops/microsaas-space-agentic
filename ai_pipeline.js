// ai_pipeline.js
import fs from "fs";
import fetch from "node-fetch";

async function run() {
  console.log("🔁 Micro-SaaS AI pipeline starting...");

  // Optionally read micro-saas-space.json to show the workflow
  const cfg = JSON.parse(fs.readFileSync("./micro-saas-space.json", "utf8"));
  console.log("Loaded agents:", cfg.agents?.map(a => a.name).join(", "));

  // Example: call a local endpoint or webhook to inform n8n that AI pipeline started
  const n8nHost = process.env.N8N_HOST;
  if (n8nHost) {
    try {
      await fetch(`${n8nHost}/webhook/microsaas-space/ai-start`, { method: "POST" });
      console.log("Notified n8n of AI pipeline start");
    } catch (e) {
      console.warn("Could not reach n8n:", e.message);
    }
  }

  // Final: print success (agents themselves will execute in Replit)
  console.log("✅ ai_pipeline.js completed (agents run via Replit agent.run).");
}

run().catch(err => { console.error("Pipeline error:", err); process.exit(1); });
