/**
 * Adjust a future nominal value to real (today's purchasing power)
 */
export function adjustForInflation(nominalValue: number, inflationRate: number, years: number): number {
  return nominalValue / Math.pow(1 + inflationRate / 100, years);
}

/**
 * Calculate the inflation factor for a given number of years
 */
export function inflationFactor(inflationRate: number, years: number): number {
  return Math.pow(1 + inflationRate / 100, years);
}

/**
 * Monthly inflation rate from annual
 */
export function monthlyInflationRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}
