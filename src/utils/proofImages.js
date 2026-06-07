import proofData from "../data/proofs.json";

// Images live in public/proofs/ and are served as plain static assets.
// Prepend BASE_URL so the paths resolve correctly on GitHub Pages (/fantazy-statistics/).
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getProofUrls(seasonId) {
  return (proofData[String(seasonId)] ?? []).map((p) => base + p);
}
