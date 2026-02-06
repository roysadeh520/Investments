import { useState, useCallback } from 'react';
import type { AppState } from '../types/investments';
import type { CalculationResults, OpportunityCostResult, BreakEvenData } from '../types/results';
import { calculateStockMarket } from '../calculations/stockMarket';
import { calculateCheckingAccount } from '../calculations/checkingAccount';
import { calculateLowRisk } from '../calculations/lowRisk';
import { calculateRealEstate } from '../calculations/realEstate';

export function useInvestmentCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [opportunityCost, setOpportunityCost] = useState<OpportunityCostResult | null>(null);
  const [breakEvenData, setBreakEvenData] = useState<BreakEvenData[] | null>(null);

  const calculate = useCallback((state: AppState) => {
    const newResults: CalculationResults = {};

    if (state.activeInvestments.includes('stockMarket')) {
      newResults.stockMarket = calculateStockMarket(state.stockMarket, state.globalInputs);
    }

    if (state.activeInvestments.includes('checkingAccount')) {
      newResults.checkingAccount = calculateCheckingAccount(state.checkingAccount, state.globalInputs);
    }

    if (state.activeInvestments.includes('lowRisk')) {
      newResults.lowRisk = calculateLowRisk(state.lowRisk, state.globalInputs);
    }

    if (state.activeInvestments.includes('realEstate')) {
      newResults.realEstate = calculateRealEstate(state.realEstate, state.globalInputs);
    }

    setResults(newResults);

    // Opportunity Cost: What if RE down payment was invested in stocks?
    if (newResults.realEstate && state.activeInvestments.includes('realEstate')) {
      const re = newResults.realEstate;
      const alternativeStock = calculateStockMarket(
        {
          initialInvestment: re.totalUpfrontCosts,
          monthlyContribution: re.mortgage.initialMonthlyPayment - (re.totalRentalIncome / (state.globalInputs.years * 12)),
          annualReturn: state.stockMarket.annualReturn,
          managementFeePercent: state.stockMarket.managementFeePercent,
        },
        state.globalInputs
      );

      const difference = re.netProfit - alternativeStock.netProfit;
      setOpportunityCost({
        alternativeStockValue: alternativeStock.netFinalValue,
        alternativeProfit: alternativeStock.netProfit,
        realEstateTotalReturn: re.netProfit,
        difference,
        betterOption: difference > 0 ? 'realEstate' : 'stock',
      });
    } else {
      setOpportunityCost(null);
    }

    // Break-Even: When does RE beat stocks?
    if (
      state.activeInvestments.includes('realEstate') &&
      state.activeInvestments.includes('stockMarket')
    ) {
      const maxYears = Math.max(state.globalInputs.years, 30);
      const breakEvenPoints: BreakEvenData[] = [];
      let breakEvenYear: number | null = null;

      for (let y = 1; y <= maxYears; y++) {
        const yearGlobal = { ...state.globalInputs, years: y };
        const stockResult = calculateStockMarket(state.stockMarket, yearGlobal);
        const reResult = calculateRealEstate(state.realEstate, yearGlobal);

        const stockNet = stockResult.netProfit;
        const reNet = reResult.netProfit;

        if (breakEvenYear === null && reNet > stockNet) {
          breakEvenYear = y;
        }

        breakEvenPoints.push({
          year: y,
          stockValue: stockNet,
          realEstateValue: reNet,
          breakEvenYear,
        });
      }

      setBreakEvenData(breakEvenPoints);
    } else {
      setBreakEvenData(null);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setOpportunityCost(null);
    setBreakEvenData(null);
  }, []);

  return {
    results,
    opportunityCost,
    breakEvenData,
    calculate,
    clearResults,
  };
}
