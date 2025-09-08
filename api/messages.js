// api/messages.js
export default async function handler(req, res) {
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzn8wT-tgQEn3xQn1BJTfpL-B-dDdhw5ZMJQYU3fabNJaScYPXj1lPM-hvKuGJO_A4/exec";

  if (req.method === "POST") {
    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Proxy POST failed", details: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Proxy GET failed", details: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
