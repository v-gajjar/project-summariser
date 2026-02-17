export function generateSummary(text) {
  // Fake summarisation logic for now
  return {
    portfolioCard: `${text.slice(0, 100)}...`,
    cvBullet: `${text.slice(0, 100)}.`,
    readmeIntro: `${text.slice(0, 100)}.`,
  };
}
