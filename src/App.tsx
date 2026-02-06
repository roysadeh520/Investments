import { useCallback } from 'react';
import { useLocalStorage, useTheme } from './hooks/useLocalStorage';
import { useInvestmentCalculator } from './hooks/useInvestmentCalculator';
import { DEFAULT_STATE, INVESTMENT_LABELS, INVESTMENT_ICONS, INVESTMENT_COLORS, RISK_LEVELS } from './constants/defaults';
import type { AppState, InvestmentType, GlobalInputs, StockMarketInputs, CheckingAccountInputs, LowRiskInputs, RealEstateInputs } from './types/investments';

import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import GlobalInputsComponent from './components/inputs/GlobalInputs';
import StockMarketInputsComponent from './components/inputs/StockMarketInputs';
import CheckingAccountInputsComponent from './components/inputs/CheckingAccountInputs';
import LowRiskInputsComponent from './components/inputs/LowRiskInputs';
import RealEstateInputsComponent from './components/inputs/RealEstateInputs';
import ToggleCard from './components/common/ToggleCard';
import ComparisonDashboard from './components/results/ComparisonDashboard';
import ScenarioManager from './components/features/ScenarioManager';

const INVESTMENT_TYPES: InvestmentType[] = ['stockMarket', 'checkingAccount', 'lowRisk', 'realEstate'];

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [state, setState] = useLocalStorage<AppState>('investment-state', DEFAULT_STATE);
  const { results, opportunityCost, breakEvenData, calculate, clearResults } = useInvestmentCalculator();

  const toggleInvestment = useCallback((type: InvestmentType) => {
    setState((prev) => {
      const isActive = prev.activeInvestments.includes(type);
      const newActive = isActive
        ? prev.activeInvestments.filter((t) => t !== type)
        : [...prev.activeInvestments, type];
      return { ...prev, activeInvestments: newActive };
    });
    clearResults();
  }, [setState, clearResults]);

  const updateGlobal = useCallback((values: GlobalInputs) => {
    setState((prev) => ({ ...prev, globalInputs: values }));
    clearResults();
  }, [setState, clearResults]);

  const updateStock = useCallback((values: StockMarketInputs) => {
    setState((prev) => ({ ...prev, stockMarket: values }));
    clearResults();
  }, [setState, clearResults]);

  const updateChecking = useCallback((values: CheckingAccountInputs) => {
    setState((prev) => ({ ...prev, checkingAccount: values }));
    clearResults();
  }, [setState, clearResults]);

  const updateLowRisk = useCallback((values: LowRiskInputs) => {
    setState((prev) => ({ ...prev, lowRisk: values }));
    clearResults();
  }, [setState, clearResults]);

  const updateRealEstate = useCallback((values: RealEstateInputs) => {
    setState((prev) => ({ ...prev, realEstate: values }));
    clearResults();
  }, [setState, clearResults]);

  const handleCalculate = useCallback(() => {
    calculate(state);
  }, [calculate, state]);

  const handleLoadScenario = useCallback((loadedState: AppState) => {
    setState(loadedState);
    clearResults();
  }, [setState, clearResults]);

  const handleReset = useCallback(() => {
    setState(DEFAULT_STATE);
    clearResults();
  }, [setState, clearResults]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <AppHeader isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Global Inputs */}
        <GlobalInputsComponent values={state.globalInputs} onChange={updateGlobal} />

        {/* Investment Type Selector */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
            בחר סוגי השקעות להשוואה
          </h2>
          <div className="flex flex-wrap gap-3">
            {INVESTMENT_TYPES.map((type) => (
              <ToggleCard
                key={type}
                label={INVESTMENT_LABELS[type]}
                icon={INVESTMENT_ICONS[type]}
                isActive={state.activeInvestments.includes(type)}
                color={INVESTMENT_COLORS[type]}
                riskLevel={RISK_LEVELS[type].level}
                riskColor={RISK_LEVELS[type].color}
                onToggle={() => toggleInvestment(type)}
              />
            ))}
          </div>
        </div>

        {/* Input Forms */}
        {state.activeInvestments.includes('stockMarket') && (
          <StockMarketInputsComponent values={state.stockMarket} onChange={updateStock} />
        )}
        {state.activeInvestments.includes('checkingAccount') && (
          <CheckingAccountInputsComponent values={state.checkingAccount} onChange={updateChecking} />
        )}
        {state.activeInvestments.includes('lowRisk') && (
          <LowRiskInputsComponent values={state.lowRisk} onChange={updateLowRisk} />
        )}
        {state.activeInvestments.includes('realEstate') && (
          <RealEstateInputsComponent values={state.realEstate} onChange={updateRealEstate} />
        )}

        {/* Calculate Button */}
        {state.activeInvestments.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleCalculate}
              className="btn-primary text-xl px-12 py-4"
            >
              🔍 חשב והשווה
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary"
              title="איפוס לערכי ברירת מחדל"
            >
              🔄 איפוס
            </button>
          </div>
        )}

        {state.activeInvestments.length === 0 && (
          <div className="card text-center py-12">
            <span className="text-6xl mb-4 block">👆</span>
            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">
              בחר לפחות סוג השקעה אחד כדי להתחיל
            </h3>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="border-t-4 border-primary-500 pt-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
                📊 תוצאות ההשוואה
              </h2>
            </div>
            <ComparisonDashboard
              results={results}
              activeInvestments={state.activeInvestments}
              opportunityCost={opportunityCost}
              breakEvenData={breakEvenData}
            />
          </div>
        )}

        {/* Scenario Manager */}
        <ScenarioManager currentState={state} onLoad={handleLoadScenario} />
      </main>

      <AppFooter />
    </div>
  );
}
