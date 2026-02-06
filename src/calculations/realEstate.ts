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
    cpiLinkedPercent, cpiLinkedInterestRate, cpiLinkedYears, annualAppreciation,
    monthlyRent, annualRentIncrease, vacancyRatePercent,
    annualMaintenanceCost, isFirstApartment, lawyerAndAgentPercent,
    rentalTaxTrack, renovationCost, annualInsurance,
  } = inputs;
  const { inflationRate, years } = global;

  // ========== UPFRONT COSTS ==========
  const downPayment = apartmentPrice * (1 - mortgagePercent / 100);
  const purchaseTax = calculatePurchaseTax(apartmentPrice, isFirstApartment);
  const lawyerAndAgentCost = apartmentPrice * (lawyerAndAgentPercent / 100);
  const totalUpfrontCosts = downPayment + purchaseTax + lawyerAndAgentCost + renovationCost;

  // ========== MORTGAGE ==========
  const totalMortgage = apartmentPrice * (mortgagePercent / 100);
  const effectiveCpiYears = cpiLinkedPercent > 0 ? cpiLinkedYears : mortgageYears;
  const maxMortgageYears = Math.max(mortgageYears, effectiveCpiYears);
  const mortgage = calculateFullMortgage(
    totalMortgage,
    cpiLinkedPercent,
    mortgageInterestRate,
    cpiLinkedInterestRate,
    mortgageYears,
    effectiveCpiYears,
    inflationRate
  );

  // ========== YEAR-BY-YEAR SIMULATION ==========
  const yearlyData: YearlyDataPoint[] = [];
  let totalRentalIncomeGross = 0;
  let totalRentalTax = 0;
  let totalMaintenanceCosts = 0;
  let totalMortgagePaid = 0;

  for (let year = 0; year <= years; year++) {
    // Property value at this year
    const propertyValue = apartmentPrice * Math.pow(1 + annualAppreciation / 100, year);

    // Remaining mortgage balance
    const mortgageMonth = Math.min(year * 12, maxMortgageYears * 12);
    const remainingMortgageBalance = mortgage.balanceAtMonth(mortgageMonth);

    // Equity = property value - remaining debt
    const equity = propertyValue - remainingMortgageBalance;

    // Accumulate cash flows for this year
    if (year > 0) {
      const yearlyRent = monthlyRent * 12 * Math.pow(1 + annualRentIncrease / 100, year - 1);
      const effectiveRent = yearlyRent * (1 - vacancyRatePercent / 100);
      const rentalTax = calculateRentalTax(effectiveRent, rentalTaxTrack);
      const yearMaintenance = annualMaintenanceCost + annualInsurance;

      totalRentalIncomeGross += effectiveRent;
      totalRentalTax += rentalTax;
      totalMaintenanceCosts += yearMaintenance;

      // Mortgage payments for this year (only if still within mortgage period)
      if (year <= maxMortgageYears) {
        for (let m = (year - 1) * 12 + 1; m <= year * 12; m++) {
          totalMortgagePaid += mortgage.paymentAtMonth(m);
        }
      }
    }

    // Net position for chart:
    // What you'd have if you sell now = equity + rent collected - all cash spent
    const totalCashOut = totalUpfrontCosts + totalMortgagePaid + totalMaintenanceCosts + totalRentalTax;
    const netPosition = equity + totalRentalIncomeGross - totalCashOut;

    yearlyData.push({
      year,
      nominalValue: Math.round(netPosition),
      realValue: Math.round(adjustForInflation(netPosition, inflationRate, year)),
      totalContributions: Math.round(totalCashOut - totalRentalIncomeGross),
    });
  }

  // ========== FINAL CALCULATIONS ==========

  // Property
  const futurePropertyValue = apartmentPrice * Math.pow(1 + annualAppreciation / 100, years);
  const appreciation = futurePropertyValue - apartmentPrice;
  const remainingMortgage = mortgage.balanceAtMonth(Math.min(years * 12, maxMortgageYears * 12));
  const equity = futurePropertyValue - remainingMortgage;

  // Capital gains tax (on property appreciation)
  const capitalGainsTax = calculateRealEstateCapitalGainsTax(appreciation);

  // Net rental income (after tax and maintenance)
  const netRentalIncome = totalRentalIncomeGross - totalRentalTax - totalMaintenanceCosts;

  // ========== PROFIT CALCULATION ==========
  //
  // The TRUE profit from real estate must account for ALL cash flows:
  //
  // Money OUT (total cash spent):
  //   1. Upfront: down payment + purchase tax + lawyer/agent + renovation
  //   2. Mortgage payments over the period (principal + INTEREST)
  //   3. Maintenance + insurance
  //   4. Rental income tax
  //
  // Money IN (total value received):
  //   1. Equity in property at end (future value - remaining mortgage)
  //   2. Gross rental income received over the period
  //
  // GROSS PROFIT = Money IN - Money OUT
  // NET PROFIT = Gross Profit - Capital Gains Tax (on sale)
  //
  const totalCashOut = totalUpfrontCosts + totalMortgagePaid + totalMaintenanceCosts + totalRentalTax;
  const totalCashIn = equity + totalRentalIncomeGross;

  const grossProfit = totalCashIn - totalCashOut;
  const netProfit = grossProfit - capitalGainsTax;

  // For display: total contributions = net cash out of pocket
  const totalContributions = totalCashOut - totalRentalIncomeGross;

  // grossFinalValue = total value if you sell + rent collected
  const grossFinalValue = equity + totalRentalIncomeGross;

  // netFinalValue = what you end up with after all taxes
  const netFinalValue = equity - capitalGainsTax + netRentalIncome;

  // Real (inflation-adjusted)
  const realNetProfit = adjustForInflation(totalUpfrontCosts + netProfit, inflationRate, years) - totalUpfrontCosts;
  const realFinalValue = adjustForInflation(netFinalValue, inflationRate, years);
  const realProfit = realNetProfit;

  // Monthly payment at the end of the period
  const monthlyPaymentAtEnd = years <= maxMortgageYears
    ? mortgage.paymentAtMonth(years * 12)
    : 0;

  // Monthly cash flow: rent - mortgage payment - maintenance
  const initialMonthlyRent = monthlyRent * (1 - vacancyRatePercent / 100);
  const initialMonthlyMaintenance = (annualMaintenanceCost + annualInsurance) / 12;
  const monthlyCashFlow = initialMonthlyRent - mortgage.initialMonthlyPayment - initialMonthlyMaintenance;

  // Cash-on-cash return (% return on initial equity invested)
  const cashOnCashReturn = totalUpfrontCosts > 0
    ? (netProfit / totalUpfrontCosts) * 100
    : 0;

  // Annualized return on equity invested
  const annualizedReturn = totalUpfrontCosts > 0 && years > 0
    ? (Math.pow(Math.max(0.001, totalUpfrontCosts + netProfit) / totalUpfrontCosts, 1 / years) - 1) * 100
    : 0;

  // Mortgage breakdown - use actual simulated values
  const totalInterestPaid = totalMortgagePaid - (totalMortgage - remainingMortgage);

  const mortgageBreakdown: MortgageBreakdown = {
    initialMonthlyPayment: Math.round(mortgage.initialMonthlyPayment),
    finalMonthlyPayment: Math.round(monthlyPaymentAtEnd),
    totalPaid: Math.round(totalMortgagePaid),
    totalInterest: Math.round(Math.max(0, totalInterestPaid)),
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
    totalRentalIncome: Math.round(totalRentalIncomeGross),
    netRentalIncome: Math.round(netRentalIncome),
    totalMaintenanceCosts: Math.round(totalMaintenanceCosts),
    totalMortgagePaid: Math.round(totalMortgagePaid),
    remainingMortgage: Math.round(remainingMortgage),
    equity: Math.round(equity),
    monthlyPaymentAtEnd: Math.round(monthlyPaymentAtEnd),
    monthlyCashFlow: Math.round(monthlyCashFlow),
    cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
  };
}
