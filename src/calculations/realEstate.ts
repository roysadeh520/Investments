import type { RealEstateInputs, GlobalInputs } from '../types/investments';
import type { RealEstateResult, YearlyDataPoint, MortgageBreakdown } from '../types/results';
import { adjustForInflation } from './inflation';
import { calculatePurchaseTax, calculateRentalTax, calculateRealEstateCapitalGainsTax } from './tax';
import { calculateFullMortgage } from './mortgage';

export function calculateRealEstate(
  inputs: RealEstateInputs,
  global: GlobalInputs
): RealEstateResult {
  const {
    apartmentPrice, mortgagePercent, mortgageYears, mortgageInterestRate,
    cpiLinkedPercent, cpiLinkedInterestRate, annualAppreciation,
    monthlyRent, annualRentIncrease, vacancyRatePercent,
    annualMaintenanceCost, isFirstApartment, lawyerAndAgentPercent,
    rentalTaxTrack, renovationCost, annualInsurance,
  } = inputs;
  const { inflationRate, years } = global;

  // Upfront costs
  const downPayment = apartmentPrice * (1 - mortgagePercent / 100);
  const purchaseTax = calculatePurchaseTax(apartmentPrice, isFirstApartment);
  const lawyerAndAgentCost = apartmentPrice * (lawyerAndAgentPercent / 100);
  const totalUpfrontCosts = downPayment + purchaseTax + lawyerAndAgentCost + renovationCost;

  // Mortgage
  const totalMortgage = apartmentPrice * (mortgagePercent / 100);
  const mortgage = calculateFullMortgage(
    totalMortgage,
    cpiLinkedPercent,
    mortgageInterestRate,
    cpiLinkedInterestRate,
    mortgageYears,
    inflationRate
  );

  // Year-by-year simulation
  const yearlyData: YearlyDataPoint[] = [];
  let totalRentalIncome = 0;
  let netRentalIncome = 0;
  let totalMaintenanceCosts = 0;
  let totalMortgagePaid = 0;

  for (let year = 0; year <= years; year++) {
    // Property value
    const propertyValue = apartmentPrice * Math.pow(1 + annualAppreciation / 100, year);

    // Remaining mortgage balance
    const mortgageMonth = Math.min(year * 12, mortgageYears * 12);
    const remainingMortgageBalance = mortgage.balanceAtMonth(mortgageMonth);

    // Equity
    const equity = propertyValue - remainingMortgageBalance;

    // Rental income for this year
    if (year > 0) {
      const yearlyRent = monthlyRent * 12 * Math.pow(1 + annualRentIncrease / 100, year - 1);
      const effectiveRent = yearlyRent * (1 - vacancyRatePercent / 100);
      const rentalTax = calculateRentalTax(effectiveRent, rentalTaxTrack);
      const yearMaintenance = annualMaintenanceCost + annualInsurance;

      totalRentalIncome += effectiveRent;
      netRentalIncome += effectiveRent - rentalTax - yearMaintenance;
      totalMaintenanceCosts += yearMaintenance;

      // Mortgage payments for this year
      if (year <= mortgageYears) {
        for (let m = (year - 1) * 12 + 1; m <= year * 12; m++) {
          totalMortgagePaid += mortgage.paymentAtMonth(m);
        }
      }
    }

    const realValue = adjustForInflation(equity, inflationRate, year);

    yearlyData.push({
      year,
      nominalValue: Math.round(equity),
      realValue: Math.round(realValue),
      totalContributions: Math.round(totalUpfrontCosts + totalMortgagePaid),
    });
  }

  // Final values
  const futurePropertyValue = apartmentPrice * Math.pow(1 + annualAppreciation / 100, years);
  const appreciation = futurePropertyValue - apartmentPrice;
  const capitalGainsTax = calculateRealEstateCapitalGainsTax(appreciation);
  const remainingMortgage = mortgage.balanceAtMonth(Math.min(years * 12, mortgageYears * 12));

  const equity = futurePropertyValue - remainingMortgage;
  const totalContributions = totalUpfrontCosts + totalMortgagePaid - totalRentalIncome;

  const grossFinalValue = futurePropertyValue + totalRentalIncome;
  const grossProfit = equity - downPayment + netRentalIncome;
  const netFinalValue = equity - capitalGainsTax + netRentalIncome;
  const netProfit = netFinalValue - totalUpfrontCosts;
  const realFinalValue = adjustForInflation(netFinalValue, inflationRate, years);
  const realProfit = realFinalValue - totalUpfrontCosts;

  // Monthly payment at the end of the period
  const monthlyPaymentAtEnd = years <= mortgageYears
    ? mortgage.paymentAtMonth(years * 12)
    : 0;

  // Cash on cash return
  const totalCashOutOfPocket = totalUpfrontCosts + totalMortgagePaid - totalRentalIncome;
  const cashOnCashReturn = totalCashOutOfPocket > 0
    ? (netProfit / totalCashOutOfPocket) * 100
    : 0;

  // Annualized return
  const annualizedReturn = totalUpfrontCosts > 0 && years > 0
    ? (Math.pow((totalUpfrontCosts + netProfit) / totalUpfrontCosts, 1 / years) - 1) * 100
    : 0;

  const mortgageBreakdown: MortgageBreakdown = {
    initialMonthlyPayment: Math.round(mortgage.initialMonthlyPayment),
    finalMonthlyPayment: Math.round(monthlyPaymentAtEnd),
    totalPaid: Math.round(mortgage.totalPaid),
    totalInterest: Math.round(mortgage.totalInterest),
    nonLinkedPayment: Math.round(mortgage.nonLinked.monthlyPayment),
    cpiLinkedPayment: Math.round(mortgage.cpiLinked.monthlyPayment),
  };

  return {
    type: 'realEstate',
    totalContributions: Math.round(Math.max(0, totalContributions)),
    grossFinalValue: Math.round(grossFinalValue),
    grossProfit: Math.round(grossProfit),
    taxAmount: Math.round(capitalGainsTax),
    netFinalValue: Math.round(netFinalValue),
    netProfit: Math.round(netProfit),
    realFinalValue: Math.round(realFinalValue),
    realProfit: Math.round(realProfit),
    annualizedReturn: Math.round(annualizedReturn * 100) / 100,
    yearlyData,
    mortgage: mortgageBreakdown,
    downPayment: Math.round(downPayment),
    purchaseTax,
    totalUpfrontCosts: Math.round(totalUpfrontCosts),
    futurePropertyValue: Math.round(futurePropertyValue),
    totalRentalIncome: Math.round(totalRentalIncome),
    netRentalIncome: Math.round(netRentalIncome),
    totalMaintenanceCosts: Math.round(totalMaintenanceCosts),
    remainingMortgage: Math.round(remainingMortgage),
    equity: Math.round(equity),
    monthlyPaymentAtEnd: Math.round(monthlyPaymentAtEnd),
    cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
  };
}
