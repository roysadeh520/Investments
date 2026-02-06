import { monthlyInflationRate } from './inflation';

export interface MortgageTrackResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  balanceAtMonth: (month: number) => number;
}

/**
 * Calculate PMT (monthly payment) for a standard fixed-rate mortgage
 */
export function calculatePMT(principal: number, annualRate: number, years: number): number {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);

  const r = annualRate / 100 / 12;
  const n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Calculate remaining balance for a fixed-rate mortgage at a specific month
 */
export function remainingBalance(principal: number, annualRate: number, years: number, atMonth: number): number {
  if (principal <= 0) return 0;
  if (atMonth <= 0) return principal;

  const r = annualRate / 100 / 12;
  const n = years * 12;

  if (atMonth >= n) return 0;

  if (annualRate <= 0) {
    const monthlyPayment = principal / n;
    return Math.max(0, principal - monthlyPayment * atMonth);
  }

  return principal * (Math.pow(1 + r, n) - Math.pow(1 + r, atMonth)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Calculate non-linked (Kalatz) mortgage track
 */
export function calculateNonLinkedTrack(principal: number, annualRate: number, years: number): MortgageTrackResult {
  const monthlyPayment = calculatePMT(principal, annualRate, years);
  const n = years * 12;
  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - principal;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
    balanceAtMonth: (month: number) => remainingBalance(principal, annualRate, years, month),
  };
}

/**
 * Calculate CPI-linked mortgage track (month-by-month simulation)
 * The payment grows with inflation, and the outstanding balance is also CPI-adjusted
 */
export function calculateCPILinkedTrack(
  principal: number,
  annualRate: number,
  years: number,
  annualInflation: number
): MortgageTrackResult & { paymentAtMonth: (month: number) => number } {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const monthlyInfl = monthlyInflationRate(annualInflation);

  // Base PMT (at month 0 terms)
  const basePMT = calculatePMT(principal, annualRate, years);

  // Simulate month-by-month to get accurate totals
  let balance = principal;
  let totalPaid = 0;
  const balances: number[] = [principal];

  for (let month = 1; month <= n; month++) {
    // CPI adjustment to balance
    balance = balance * (1 + monthlyInfl);

    // Interest for this month
    const interest = balance * r;

    // Payment grows with inflation
    const payment = basePMT * Math.pow(1 + monthlyInfl, month);

    // Principal portion
    const principalPortion = payment - interest;

    balance = Math.max(0, balance - principalPortion);
    totalPaid += payment;
    balances.push(balance);
  }

  return {
    monthlyPayment: basePMT,
    totalPaid,
    totalInterest: totalPaid - principal,
    balanceAtMonth: (month: number) => {
      if (month <= 0) return principal;
      if (month >= n) return 0;
      return balances[month] ?? 0;
    },
    paymentAtMonth: (month: number) => basePMT * Math.pow(1 + monthlyInfl, month),
  };
}

/**
 * Calculate full mortgage with both tracks
 */
export function calculateFullMortgage(
  totalMortgage: number,
  cpiLinkedPercent: number,
  nonLinkedRate: number,
  cpiLinkedRate: number,
  nonLinkedYears: number,
  cpiLinkedYears: number,
  annualInflation: number
) {
  const cpiPrincipal = totalMortgage * (cpiLinkedPercent / 100);
  const nonLinkedPrincipal = totalMortgage - cpiPrincipal;

  const nonLinked = calculateNonLinkedTrack(nonLinkedPrincipal, nonLinkedRate, nonLinkedYears);
  const cpiLinked = calculateCPILinkedTrack(cpiPrincipal, cpiLinkedRate, cpiLinkedYears, annualInflation);

  const initialMonthlyPayment = nonLinked.monthlyPayment + cpiLinked.monthlyPayment;
  const totalPaid = nonLinked.totalPaid + cpiLinked.totalPaid;
  const totalInterest = nonLinked.totalInterest + cpiLinked.totalInterest;

  const maxYears = Math.max(nonLinkedYears, cpiLinkedYears);

  return {
    nonLinked,
    cpiLinked,
    initialMonthlyPayment,
    totalPaid,
    totalInterest,
    maxYears,
    paymentAtMonth: (month: number) => {
      const nlPayment = month <= nonLinkedYears * 12 ? nonLinked.monthlyPayment : 0;
      const cpiPayment = month <= cpiLinkedYears * 12 ? cpiLinked.paymentAtMonth(month) : 0;
      return nlPayment + cpiPayment;
    },
    balanceAtMonth: (month: number) => nonLinked.balanceAtMonth(month) + cpiLinked.balanceAtMonth(month),
  };
}
