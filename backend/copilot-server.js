/* SMART-MEDX Health Copilot backend
   Run:  npm install express cors @anthropic-ai/sdk
         ANTHROPIC_API_KEY=sk-ant-... node copilot-server.js
   (package.json needs  "type": "module")                                   */

import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";

const PORT = process.env.PORT || 5001;
const MODEL = process.env.COPILOT_MODEL || "claude-sonnet-5-5";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY
const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "15mb" }));

const LANG_NAMES = { en: "English", hi: "Hindi (हिन्दी)", te: "Telugu (తెలుగు)" };
const FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"];

/* Very small in-memory rate limit: 20 requests / minute / IP. Use a real one in production. */
const hits = new Map();
const limited = (ip) => {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
};

const systemPrompt = (lang, patient) => `
You are the SMART-MEDX Health Copilot, a warm, patient, multilingual health assistant for people in India.
You talk like a caring, knowledgeable friend, not like a textbook.

LANGUAGE
- Reply in ${LANG_NAMES[lang]}. If the user clearly writes in a different one of English, Hindi or Telugu, reply in that language instead.
- Use simple everyday words. Keep medical terms in English in brackets the first time, for example "హిమోగ్లోబిన్ (Hemoglobin)".

WHEN A DOCUMENT (lab report, prescription, discharge summary, scan report) IS ATTACHED
1. Extract the data faithfully into "extracted". Never invent or guess values. If something is unreadable, leave it out and say so in the reply.
2. In "reply", explain in detail: what the document is, then each important result or medicine in turn.
   - For each lab value: what the test measures, whether the value is low, normal or high against the reference range printed on the document, what that can generally mean, common harmless causes, and what to ask the doctor.
   - For each medicine: what it is usually used for, how it is written to be taken, common side effects, and anything to watch for.
   - Check every medicine against the patient's allergies and current medicines below and clearly flag any possible conflict.
   - Finish with a short plain summary and what to discuss with the doctor.
3. If the patient name on the document does not match the profile, mention it gently.

SAFETY RULES
- Never diagnose, never prescribe, never change or stop a dose. Say what a result may generally mean and recommend confirming with their doctor.
- If there are signs of an emergency (chest pain, trouble breathing, stroke signs, heavy bleeding, suicidal thoughts, etc.), put urgent advice first: call 108 or 112 now.
- If you are unsure, say so. Do not make up facts.
- Do not repeat Aadhaar numbers or phone numbers.

PATIENT PROFILE (from the SMART-MEDX health record)
${JSON.stringify(patient || {}, null, 2)}

OUTPUT FORMAT
Return ONLY one JSON object, no text before or after, no code fences:
{
  "reply": string,         // plain text, no markdown symbols. Short paragraphs separated by a blank line. Use "- " for lists.
  "extracted": null | {    // null when no document was attached
    "documentType": string, "date": string, "provider": string, "patientName": string,
    "labResults": [ { "test": string, "value": string, "unit": string, "referenceRange": string, "status": "low" | "normal" | "high" | "abnormal" | "unknown" } ],
    "medicines": [ { "name": string, "dose": string, "frequency": string, "duration": string } ],
    "diagnoses": [ string ],
    "notes": string
  },
  "followUps": [ string ]  // up to 3 short follow-up questions the patient might ask next, in the reply language
}`;

function toContent(m) {
  if (m.role === "assistant") return String(m.text || "(no reply)");
  const blocks = [];
  if (m.file && FILE_TYPES.includes(m.file.mediaType) && m.file.data) {
    const source = { type: "base64", media_type: m.file.mediaType, data: m.file.data };
    blocks.push(m.file.mediaType === "application/pdf" ? { type: "document", source } : { type: "image", source });
  }
  blocks.push({ type: "text", text: String(m.text || "(no text)").slice(0, 4000) });
  return blocks;
}

function parseModel(text) {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s >= 0 && e > s) {
    try {
      return JSON.parse(text.slice(s, e + 1));
    } catch {
      /* fall through */
    }
  }
  return { reply: text, extracted: null, followUps: [] };
}

app.post("/api/copilot", async (req, res) => {
  try {
    if (limited(req.ip)) return res.status(429).json({ error: "Too many requests" });

    const { lang, patient, messages } = req.body || {};
    if (!LANG_NAMES[lang] || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // keep the last 20 turns, and make sure the conversation starts with a user turn
    let turns = messages.slice(-20).filter((m) => m && (m.role === "user" || m.role === "assistant"));
    while (turns.length && turns[0].role !== "user") turns.shift();
    if (!turns.length) return res.status(400).json({ error: "Invalid request" });

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 3000,
      system: systemPrompt(lang, patient),
      messages: turns.map((m) => ({ role: m.role, content: toContent(m) })),
    });

    const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    const out = parseModel(text);
    res.json({
      reply: typeof out.reply === "string" ? out.reply : "",
      extracted: out.extracted && typeof out.extracted === "object" ? out.extracted : null,
      followUps: Array.isArray(out.followUps) ? out.followUps.slice(0, 3) : [],
    });
  } catch (err) {
    console.error("copilot error:", err.status || "", err.message);
    res.status(500).json({ error: "Copilot failed" });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Health Copilot API on http://localhost:${PORT}`));