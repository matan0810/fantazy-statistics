import proofData from "../data/proofs.json";

const images = import.meta.glob("../final results/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export function getProofUrls(seasonId) {
  const paths = proofData[String(seasonId)] ?? [];
  return paths.map((p) => images[p]).filter(Boolean);
}
