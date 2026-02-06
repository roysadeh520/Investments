export type InvestmentType = 'stockMarket' | 'checkingAccount' | 'lowRisk' | 'realEstate';

export type TaxBracket = 'standard' | 'significant';

export type RentalTaxTrack = 'none' | '10percent' | 'exempt' | 'marginal';

export interface GlobalInputs {
  inflationRate: number;
  years: number;
  taxBracket: TaxBracket;
}

export interface StockMarketInputs {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  managementFeePercent: number;
}

export interface CheckingAccountInputs {
  amount: number;
  annualInterest: number;
}

export interface LowRiskInputs {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  managementFeePercent: number;
  isCPILinked: boolean;
}

export interface RealEstateInputs {
  apartmentPrice: number;
  mortgagePercent: number;
  mortgageYears: number;
  mortgageInterestRate: number;
  cpiLinkedPercent: number;
  cpiLinkedInterestRate: number;
  annualAppreciation: number;
  monthlyRent: number;
  annualRentIncrease: number;
  vacancyRatePercent: number;
  annualMaintenanceCost: number;
  isFirstApartment: boolean;
  lawyerAndAgentPercent: number;
  rentalTaxTrack: RentalTaxTrack;
  renovationCost: number;
  annualInsurance: number;
  cpiLinkedYears: number;
}

export interface AppState {
  globalInputs: GlobalInputs;
  activeInvestments: InvestmentType[];
  stockMarket: StockMarketInputs;
  checkingAccount: CheckingAccountInputs;
  lowRisk: LowRiskInputs;
  realEstate: RealEstateInputs;
}
