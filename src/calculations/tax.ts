import { ISRAELI_TAX } from '../constants/tax';
import type { TaxBracket, RentalTaxTrack } from '../types/investments';

/**
 * Calculate capital gains tax
 */
export function calculateCapitalGainsTax(profit: number, bracket: TaxBracket): number {
  if (profit <= 0) return 0;
  const rate = ISRAELI_TAX.capitalGains[bracket];
  return profit * rate;
}

/**
 * Calculate bank interest tax (15%)
 */
export function calculateBankInterestTax(interest: number): number {
  if (interest <= 0) return 0;
  return interest * ISRAELI_TAX.bankInterest;
}

/**
 * Calculate purchase tax (מס רכישה)
 */
export function calculatePurchaseTax(price: number, isFirstApartment: boolean): number {
  const brackets = isFirstApartment
    ? ISRAELI_TAX.purchaseTaxBrackets.firstApartment
    : ISRAELI_TAX.purchaseTaxBrackets.additionalProperty;

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (price <= previousLimit) break;

    const taxableInBracket = Math.min(price, bracket.upTo) - previousLimit;
    if (taxableInBracket > 0) {
      tax += taxableInBracket * bracket.rate;
    }
    previousLimit = bracket.upTo;
  }

  return Math.round(tax);
}

/**
 * Calculate rental income tax
 */
export function calculateRentalTax(
  annualRentalIncome: number,
  track: RentalTaxTrack
): number {
  if (annualRentalIncome <= 0) return 0;

  const monthlyIncome = annualRentalIncome / 12;

  switch (track) {
    case 'none':
      return 0;

    case 'exempt':
      if (monthlyIncome <= ISRAELI_TAX.rental.exemptMonthlyThreshold) {
        return 0;
      }
      // Above threshold - tax on the excess at marginal rate
      const excess = annualRentalIncome - ISRAELI_TAX.rental.exemptMonthlyThreshold * 12;
      return excess * ISRAELI_TAX.rental.minMarginalRate;

    case '10percent':
      return annualRentalIncome * ISRAELI_TAX.rental.flatRate;

    case 'marginal':
      return annualRentalIncome * ISRAELI_TAX.rental.minMarginalRate;

    default:
      return 0;
  }
}

/**
 * Calculate real estate capital gains tax
 */
export function calculateRealEstateCapitalGainsTax(appreciation: number): number {
  if (appreciation <= 0) return 0;
  return appreciation * ISRAELI_TAX.realEstate.capitalGains;
}
