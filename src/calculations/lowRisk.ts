import type { LowRiskInputs, GlobalInputs } from '../types/investments';
import type { LowRiskResult, YearlyDataPoint } from '../types/results';
import { adjustForInflation } from './inflation';
import { calculateCapitalGainsTax } from './tax';

export function calculateLowRisk(
  inputs: LowRiskInputs,
  global: GlobalInputs
): LowRiskResult {
  const { initialInvestment, monthlyContribution, annualReturn, managementFeePercent, isCPILinked } = inputs;
  const { inflationRate, years, taxBracket } = global;

  // If CPI-linked, the stated return is REAL (above inflation)
  // So nominal return = (1 + realReturn) * (1 + inflation) - 1
  const nominalAnnualReturn = isCPILinked
    ? ((1 + annualReturn / 100) * (1 + inflationRate / 100) - 1) * 100
    : annualReturn;

  const effectiveAnnualReturn = nominalAnnualReturn - managementFeePercent;
  const monthlyRate = Math.pow(1 + effectiveAnnualReturn / 100, 1 / 12) - 1;
  const totalMonths = years * 12;

  const yearlyData: YearlyDataPoint[] = [];
  let totalFeesPaid = 0;

  for (let year = 0; year <= years; year++) {
    const months = year * 12;
    let value: number;

    if (monthlyRate <= 0) {
      value = initialInvestment + monthlyContribution * months;
    } else {
      value = initialInvestment * Math.pow(1 + monthlyRate, months) +
        monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    }

    const contributions = initialInvestment + monthlyContribution * months;

    // Fees estimation
    const rawMonthlyRate = Math.pow(1 + nominalAnnualReturn / 100, 1 / 12) - 1;
    let grossValueNoFees: number;
    if (rawMonthlyRate <= 0) {
      grossValueNoFees = contributions;
    } else {
      grossValueNoFees = initialInvestment * Math.pow(1 + rawMonthlyRate, months) +
        monthlyContribution * (Math.pow(1 + rawMonthlyRate, months) - 1) / rawMonthlyRate;
    }

    const feesThisYear = grossValueNoFees - value - (year > 0 ? totalFeesPaid : 0);
    if (year > 0) totalFeesPaid += Math.max(0, feesThisYear);

    const realValue = adjustForInflation(value, inflationRate, year);

    yearlyData.push({
      year,
      nominalValue: Math.round(value),
      realValue: Math.round(realValue),
      totalContributions: Math.round(contributions),
    });
  }

  const totalContributions = initialInvestment + monthlyContribution * totalMonths;

  let grossFinalValue: number;
  if (monthlyRate <= 0) {
    grossFinalValue = totalContributions;
  } else {
    grossFinalValue = initialInvestment * Math.pow(1 + monthlyRate, totalMonths) +
      monthlyContribution * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
  }

  const grossProfit = grossFinalValue - totalContributions;
  const taxAmount = calculateCapitalGainsTax(grossProfit, taxBracket);
  const netFinalValue = grossFinalValue - taxAmount;
  const netProfit = netFinalValue - totalContributions;
  const realFinalValue = adjustForInflation(netFinalValue, inflationRate, years);
  const realProfit = realFinalValue - totalContributions;

  const annualizedReturn = totalContributions > 0 && years > 0
    ? (Math.pow(grossFinalValue / totalContributions, 1 / years) - 1) * 100
    : 0;

  return {
    type: 'lowRisk',
    totalContributions: Math.round(totalContributions),
    grossFinalValue: Math.round(grossFinalValue),
    grossProfit: Math.round(grossProfit),
    taxAmount: Math.round(taxAmount),
    netFinalValue: Math.round(netFinalValue),
    netProfit: Math.round(netProfit),
    realFinalValue: Math.round(realFinalValue),
    realProfit: Math.round(realProfit),
    annualizedReturn: Math.round(annualizedReturn * 100) / 100,
    totalFeesPaid: Math.round(totalFeesPaid),
    yearlyData,
  };
}
