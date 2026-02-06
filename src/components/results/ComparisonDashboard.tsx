import { useState } from 'react';
import type { CalculationResults, OpportunityCostResult, BreakEvenData } from '../../types/results';
import type { InvestmentType } from '../../types/investments';
import ResultsSummary from './ResultsSummary';
import TimelineChart from './TimelineChart';
import ResultsChart from './ResultsChart';
import InvestmentResultCard from './InvestmentResultCard';
import MortgageBreakdown from './MortgageBreakdown';
import RiskIndicator from './RiskIndicator';
import YearByYearTable from './YearByYearTable';
import OpportunityCost from './OpportunityCost';
import BreakEvenChart from './BreakEvenChart';

interface Props {
  results: CalculationResults;
  activeInvestments: InvestmentType[];
  opportunityCost: OpportunityCostResult | null;
  breakEvenData: BreakEvenData[] | null;
}

export default function ComparisonDashboard({ results, activeInvestments, opportunityCost, breakEvenData }: Props) {
  const [showReal, setShowReal] = useState(false);

  const allResults = [
    results.stockMarket,
    results.checkingAccount,
    results.lowRisk,
    results.realEstate,
  ].filter(Boolean);

  if (allResults.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Risk Indicator */}
      <RiskIndicator activeInvestments={activeInvestments} />

      {/* Summary Table */}
      <ResultsSummary results={results} />

      {/* Timeline Chart with toggle */}
      <div>
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => setShowReal(false)}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              !showReal
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            נומינלי
          </button>
          <button
            onClick={() => setShowReal(true)}
            className={`text-sm px-3 py-1 rounded-lg transition-colors ${
              showReal
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            ריאלי (מותאם אינפלציה)
          </button>
        </div>
        <TimelineChart results={results} showReal={showReal} />
      </div>

      {/* Bar Chart */}
      <ResultsChart results={results} />

      {/* Opportunity Cost */}
      {opportunityCost && <OpportunityCost data={opportunityCost} />}

      {/* Break-Even */}
      {breakEvenData && <BreakEvenChart data={breakEvenData} />}

      {/* Individual Result Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allResults.map((result) => (
          <InvestmentResultCard key={result!.type} result={result!} />
        ))}
      </div>

      {/* Mortgage Breakdown */}
      {results.realEstate && <MortgageBreakdown result={results.realEstate} />}

      {/* Year by Year Table */}
      <YearByYearTable results={results} />
    </div>
  );
}
