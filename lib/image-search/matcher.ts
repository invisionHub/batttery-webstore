/**
 * Normalizes text for comparison by removing accents, special punctuation, and converting to lowercase.
 */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s]/g, ' ') // replace punctuation with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes normalized text into a Set of distinct words (min 2 chars).
 */
export function tokenize(text: string | null | undefined): Set<string> {
  const normalized = normalizeText(text);
  if (!normalized) return new Set();

  const words = normalized
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2);

  return new Set(words);
}

/**
 * Checks whether target string contains the search phrase or token.
 */
export function containsPhrase(target: string | null | undefined, phrase: string | null | undefined): boolean {
  if (!target || !phrase) return false;
  const normTarget = normalizeText(target);
  const normPhrase = normalizeText(phrase);
  if (!normPhrase) return false;
  return normTarget.includes(normPhrase);
}

/**
 * Calculates Jaccard token overlap between a reference set and a candidate set.
 * Returns ratio from 0 to 1.
 */
export function calculateTokenOverlap(
  referenceTokens: Set<string>,
  candidateTokens: Set<string>
): { matchCount: number; ratio: number; matchedTokens: string[] } {
  if (referenceTokens.size === 0 || candidateTokens.size === 0) {
    return { matchCount: 0, ratio: 0, matchedTokens: [] };
  }

  const matchedTokens: string[] = [];
  for (const token of referenceTokens) {
    if (candidateTokens.has(token)) {
      matchedTokens.push(token);
    }
  }

  const ratio = matchedTokens.length / referenceTokens.size;
  return {
    matchCount: matchedTokens.length,
    ratio,
    matchedTokens,
  };
}
