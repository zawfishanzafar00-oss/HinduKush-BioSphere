export default function handler(req, res) {
  res.status(501).json({
    ok: false,
    message: "AI analysis is not connected in this free prototype. Use the transparent symptom and trait matching tools on the website."
  });
}
