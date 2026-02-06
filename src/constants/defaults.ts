import type { AppState } from '../types/investments';

export const DEFAULT_STATE: AppState = {
  globalInputs: {
    inflationRate: 2.5,
    years: 10,
    taxBracket: 'standard',
  },
  activeInvestments: ['stockMarket'],
  stockMarket: {
    initialInvestment: 100000,
    monthlyContribution: 2000,
    annualReturn: 8,
    managementFeePercent: 0.5,
  },
  checkingAccount: {
    amount: 100000,
    annualInterest: 0,
  },
  lowRisk: {
    initialInvestment: 100000,
    monthlyContribution: 2000,
    annualReturn: 3.5,
    managementFeePercent: 0.15,
    isCPILinked: true,
  },
  realEstate: {
    apartmentPrice: 2000000,
    mortgagePercent: 60,
    mortgageYears: 25,
    mortgageInterestRate: 4.5,
    cpiLinkedPercent: 33,
    cpiLinkedInterestRate: 3.0,
    annualAppreciation: 4,
    monthlyRent: 5500,
    annualRentIncrease: 2.5,
    vacancyRatePercent: 4,
    annualMaintenanceCost: 12000,
    isFirstApartment: true,
    lawyerAndAgentPercent: 2.5,
    rentalTaxTrack: '10percent',
    renovationCost: 0,
    annualInsurance: 2000,
  },
};

export const INVESTMENT_LABELS: Record<string, string> = {
  stockMarket: 'בורסה',
  checkingAccount: 'עו"ש',
  lowRisk: 'סיכון נמוך',
  realEstate: 'דירה',
};

export const INVESTMENT_ICONS: Record<string, string> = {
  stockMarket: '📈',
  checkingAccount: '🏦',
  lowRisk: '🛡️',
  realEstate: '🏠',
};

export const INVESTMENT_COLORS: Record<string, string> = {
  stockMarket: '#3b82f6',
  checkingAccount: '#8b5cf6',
  lowRisk: '#10b981',
  realEstate: '#f59e0b',
};

export const RISK_LEVELS: Record<string, { level: string; color: string }> = {
  stockMarket: { level: 'גבוה', color: '#ef4444' },
  checkingAccount: { level: 'אפסי', color: '#6b7280' },
  lowRisk: { level: 'נמוך', color: '#10b981' },
  realEstate: { level: 'בינוני', color: '#f59e0b' },
};
