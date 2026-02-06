export interface YearlyDataPoint {
  year: number;
  nominalValue: number;
  realValue: number;
  totalContributions: number;
}

export interface BaseInvestmentResult {
  totalContributions: number;
  grossFinalValue: number;
  grossProfit: number;
  taxAmount: number;
  netFinalValue: number;
  netProfit: number;
  realFinalValue: number;
  realProfit: number;
  annualizedReturn: number;
  yearlyData: YearlyDataPoint[];
}

export interface StockMarketResult extends BaseInvestmentResult {
  type: 'stockMarket';
  totalFeesPaid: number;
}

export interface CheckingAccountResult extends BaseInvestmentResult {
  type: 'checkingAccount';
  purchasingPowerLoss: number;
}

export interface LowRiskResult extends BaseInvestmentResult {
  type: 'lowRisk';
  totalFeesPaid: number;
}

export interface MortgageBreakdown {
  initialMonthlyPayment: number;
  finalMonthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  nonLinkedPayment: number;
  cpiLinkedPayment: number;
}

export interface RealEstateResult extends BaseInvestmentResult {
  type: 'realEstate';
  mortgage: MortgageBreakdown;
  downPayment: number;
  purchaseTax: number;
  totalUpfrontCosts: number;
  futurePropertyValue: number;
  totalRentalIncome: number;
  netRentalIncome: number;
  totalMaintenanceCosts: number;
  remainingMortgage: number;
  equity: number;
  monthlyPaymentAtEnd: number;
  cashOnCashReturn: number;
}

export type InvestmentResult = StockMarketResult | CheckingAccountResult | LowRiskResult | RealEstateResult;

export interface CalculationResults {
  stockMarket?: StockMarketResult;
  checkingAccount?: CheckingAccountResult;
  lowRisk?: LowRiskResult;
  realEstate?: RealEstateResult;
}

export interface BreakEvenData {
  year: number;
  stockValue: number;
  realEstateValue: number;
  breakEvenYear: number | null;
}

export interface OpportunityCostResult {
  alternativeStockValue: number;
  alternativeProfit: number;
  realEstateTotalReturn: number;
  difference: number;
  betterOption: 'stock' | 'realEstate';
}

export interface Scenario {
  id: string;
  name: string;
  createdAt: number;
  state: import('./investments').AppState;
}
