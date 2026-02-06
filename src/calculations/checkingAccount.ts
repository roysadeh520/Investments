import type { CheckingAccountInputs, GlobalInputs } from '../types/investments';
import type { CheckingAccountResult, YearlyDataPoint } from '../types/results';
import { adjustForInflation } from './inflation';
import { calculateBankInterestTax } from './tax';

export function calculateCheckingAccount(
  inputs: CheckingAccountInputs,
  global: GlobalInputs
): CheckingAccountResult {
  const { amount, annualInterest } = inputs;
  const { inflationRate, years } = global;

  const yearlyData: YearlyDataPoint[] = [];

  for (let year = 0; year <= years; year++) {
    const nominalValue = amount * Math.pow(1 + annualInterest / 100, year);
    const realValue = adjustForInflation(nominalValue, inflationRate, year);

    yearlyData.push({
      year,
      nominalValue: Math.round(nominalValue),
      realValue: Math.round(realValue),
      totalContributions: amount,
    });
  }

  const grossFinalValue = amount * Math.pow(1 + annualInterest / 100, years);
  const grossProfit = grossFinalValue - amount;
  const taxAmount = calculateBankInterestTax(grossProfit);
  const netFinalValue = grossFinalValue - taxAmount;
  const netProfit = netFinalValue - amount;
  const realFinalValue = adjustForInflation(netFinalValue, inflationRate, years);
  const realProfit = realFinalValue - amount;
  const purchasingPowerLoss = amount - adjustForInflation(amount, inflationRate, years);

  const annualizedReturn = annualInterest;

  return {
    type: 'checkingAccount',
    totalContributions: amount,
    grossFinalValue: Math.round(grossFinalValue),
    grossProfit: Math.round(grossProfit),
    taxAmount: Math.round(taxAmount),
    netFinalValue: Math.round(netFinalValue),
    netProfit: Math.round(netProfit),
    realFinalValue: Math.round(realFinalValue),
    realProfit: Math.round(realProfit),
    annualizedReturn: Math.round(annualizedReturn * 100) / 100,
    purchasingPowerLoss: Math.round(purchasingPowerLoss),
    yearlyData,
  };
}
