/**
 * ICC(2,1) — Two-way random, single measures, absolute agreement.
 *
 * Expects a matrix of ratings: rows = subjects (sequences), columns = raters.
 * Each cell is the ordinal score (0, 1, 3, 5) for that subject × rater.
 *
 * Only rows with ratings from all raters are included (listwise deletion).
 *
 * Returns { icc, lowerCI, upperCI, n, k } or null if computation is not possible.
 *
 * Reference: Shrout & Fleiss (1979), "Intraclass Correlations: Uses in
 * Assessing Rater Reliability", Psychological Bulletin, 86(2), 420–428.
 */

export interface ICCResult {
  icc: number;
  lowerCI: number;
  upperCI: number;
  /** Number of subjects (sequences) used */
  n: number;
  /** Number of raters */
  k: number;
}

export function computeICC21(ratings: number[][]): ICCResult | null {
  // ratings[i][j] = score by rater j for subject i
  // Filter to complete rows only
  const complete = ratings.filter(row => row.length > 0 && row.every(v => v !== undefined && v !== null));
  if (complete.length < 2) return null;

  const k = complete[0].length; // number of raters
  if (k < 2) return null;

  // Ensure all rows have the same number of raters
  const valid = complete.filter(row => row.length === k);
  const n = valid.length;
  if (n < 2) return null;

  // Grand mean
  const grandSum = valid.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0);
  const grandMean = grandSum / (n * k);

  // Row means (subject means)
  const rowMeans = valid.map(row => row.reduce((a, b) => a + b, 0) / k);

  // Column means (rater means)
  const colMeans: number[] = [];
  for (let j = 0; j < k; j++) {
    const colSum = valid.reduce((s, row) => s + row[j], 0);
    colMeans.push(colSum / n);
  }

  // Between-subjects mean square (BMS)
  const SSR = k * rowMeans.reduce((s, rm) => s + (rm - grandMean) ** 2, 0);
  const BMS = SSR / (n - 1);

  // Between-raters mean square (JMS)
  const SSC = n * colMeans.reduce((s, cm) => s + (cm - grandMean) ** 2, 0);
  const JMS = SSC / (k - 1);

  // Error/residual mean square (EMS)
  let SSE = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < k; j++) {
      SSE += (valid[i][j] - rowMeans[i] - colMeans[j] + grandMean) ** 2;
    }
  }
  const EMS = SSE / ((n - 1) * (k - 1));

  // ICC(2,1) = (BMS - EMS) / (BMS + (k-1)*EMS + k*(JMS - EMS)/n)
  const denom = BMS + (k - 1) * EMS + (k * (JMS - EMS)) / n;
  if (denom === 0) return null;

  const icc = (BMS - EMS) / denom;

  // 95% CI using F-distribution approximation (Shrout & Fleiss 1979, eq. 6)
  const FL = BMS / (k * JMS + (n - k) * EMS) !== 0
    ? (BMS / EMS) / fCritical(0.025, n - 1, (n - 1) * (k - 1))
    : 0;
  const FU = (BMS / EMS) * fCritical(0.025, (n - 1) * (k - 1), n - 1);

  // Simplified CI using the approach from McGraw & Wong (1996)
  // Lower bound
  const vn = k * (BMS - EMS) / (k * JMS + (n - k) * EMS);
  const vd = 1 + k * (BMS - EMS) / (n * EMS);

  // Use simpler Shrout-Fleiss approximate CI
  const Fobs = BMS / EMS;
  const dfN = n - 1;
  const dfD = dfN * (k - 1);

  const Flower = Fobs / fCritical(0.025, dfN, dfD);
  const Fupper = Fobs * fCritical(0.025, dfD, dfN);

  const lowerCI = Math.max(-1, (Flower - 1) / (Flower + (k - 1) + (k * (JMS - EMS)) / (BMS)));
  const upperCI = Math.min(1, (Fupper - 1) / (Fupper + (k - 1) + (k * (JMS - EMS)) / (BMS)));

  return {
    icc: clamp(icc, -1, 1),
    lowerCI: clamp(lowerCI, -1, 1),
    upperCI: clamp(upperCI, -1, 1),
    n,
    k,
  };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/**
 * Approximate F critical value using Wilson-Hilferty approximation
 * for the inverse chi-square CDF. Good enough for CI display.
 */
function fCritical(alpha: number, df1: number, df2: number): number {
  // Use z_{1-alpha} ≈ 1.96 for alpha=0.025
  const z = 1.96;

  // Wilson-Hilferty approximation for chi-square quantile
  const chiSqQuantile = (df: number, upper: boolean) => {
    const zVal = upper ? z : -z;
    const term = 1 - 2 / (9 * df) + zVal * Math.sqrt(2 / (9 * df));
    return df * Math.max(0.001, term ** 3);
  };

  const chi1 = chiSqQuantile(df1, true);
  const chi2 = chiSqQuantile(df2, false);

  if (chi2 === 0) return 999;
  return (chi1 / df1) / (chi2 / df2);
}

/**
 * Compute ICC(2,1) per dimension from paired annotation data.
 *
 * @param pairs - Array of { coderScores: Record<string, number>[] } where each
 *   entry is a sequence with scores from each coder for a given dimension's categories.
 * @param categories - The category keys to compute ICC for (e.g., D2 role names)
 * @returns Per-category ICC results and an overall (mean) ICC
 */
export function computeDimensionICC(
  pairs: { scores: Record<string, number>[] }[],
  categories: readonly string[],
): { perCategory: Record<string, ICCResult | null>; overall: ICCResult | null } {
  const perCategory: Record<string, ICCResult | null> = {};

  const allICCs: number[] = [];

  for (const cat of categories) {
    // Build ratings matrix: one row per sequence, one column per rater
    const matrix = pairs.map(p => p.scores.map(s => s[cat] ?? 0));
    const result = computeICC21(matrix);
    perCategory[cat] = result;
    if (result) allICCs.push(result.icc);
  }

  // Overall: average ICC across categories (mean of per-category ICCs)
  if (allICCs.length === 0) return { perCategory, overall: null };

  const meanICC = allICCs.reduce((a, b) => a + b, 0) / allICCs.length;
  const n = Object.values(perCategory).find(r => r)?.n ?? 0;
  const k = Object.values(perCategory).find(r => r)?.k ?? 0;

  // For the overall CI, we take the min lower and max upper (conservative)
  const lowers = Object.values(perCategory).filter(r => r).map(r => r!.lowerCI);
  const uppers = Object.values(perCategory).filter(r => r).map(r => r!.upperCI);

  return {
    perCategory,
    overall: {
      icc: meanICC,
      lowerCI: Math.min(...lowers),
      upperCI: Math.max(...uppers),
      n,
      k,
    },
  };
}
