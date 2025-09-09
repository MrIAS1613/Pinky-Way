// messages.js
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8QoCR2Nw94DsHNDMlTaQ3zw1ET01LffjGgzUO4fiVBQEcaML10Iq6Uc1DXkpHPtMm/exec";

// Safely parse JSON
async function safeJson(response) {
  try {
    return await response.json();
  } catch {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { error: "Invalid JSON", raw: text };
    }
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const data = await safeJson(response);

      if (response.ok && data.result === "success") {
        res.status(200).json({ result: "success" });
      } else {
        res.status(400).json({ result: "fail", details: data });
      }
    } catch (error) {
      res.status(500).json({ result: "fail", error: "Proxy POST failed", details: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await safeJson(response);

      if (response.ok && Array.isArray(data)) {
        res.status(200).json(data.reverse()); // latest first
      } else {
        res.status(400).json({ error: "Proxy GET failed", details: data });
      }
    } catch (error) {
      res.status(500).json({ error: "Proxy GET failed", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
