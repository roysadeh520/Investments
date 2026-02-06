import type { InvestmentResult } from '../../types/results';
import ResultCard from '../common/ResultCard';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { INVESTMENT_LABELS, INVESTMENT_COLORS, INVESTMENT_ICONS } from '../../constants/defaults';

interface Props {
  result: InvestmentResult;
}

export default function InvestmentResultCard({ result }: Props) {
  const color = INVESTMENT_COLORS[result.type];
  const label = INVESTMENT_LABELS[result.type];
  const icon = INVESTMENT_ICONS[result.type];

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color }}>
        <span className="text-2xl">{icon}</span>
        {label}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <ResultCard
          label='סה"כ הפקדות'
          value={formatCurrency(result.totalContributions)}
        />
        <ResultCard
          label="ערך ברוטו"
          value={formatCurrency(result.grossFinalValue)}
        />
        <ResultCard
          label="רווח ברוטו"
          value={formatCurrency(result.grossProfit)}
          isPositive={result.grossProfit > 0}
          isNegative={result.grossProfit < 0}
        />
        <ResultCard
          label="מס"
          value={formatCurrency(result.taxAmount)}
          isNegative={result.taxAmount > 0}
        />
        <ResultCard
          label="רווח נטו"
          value={formatCurrency(result.netProfit)}
          isPositive={result.netProfit > 0}
          isNegative={result.netProfit < 0}
          large
        />
        <ResultCard
          label="כוח קנייה ריאלי"
          value={formatCurrency(result.realProfit)}
          subValue="(מותאם לאינפלציה)"
          isPositive={result.realProfit > 0}
          isNegative={result.realProfit < 0}
        />
        <ResultCard
          label="תשואה שנתית"
          value={formatPercent(result.annualizedReturn)}
        />
        {result.type === 'stockMarket' && (
          <ResultCard
            label="דמי ניהול ששולמו"
            value={formatCurrency(result.totalFeesPaid)}
            isNegative={result.totalFeesPaid > 0}
          />
        )}
        {result.type === 'checkingAccount' && (
          <ResultCard
            label="שחיקת כוח קנייה"
            value={formatCurrency(result.purchasingPowerLoss)}
            isNegative={result.purchasingPowerLoss > 0}
          />
        )}
        {result.type === 'lowRisk' && (
          <ResultCard
            label="דמי ניהול ששולמו"
            value={formatCurrency(result.totalFeesPaid)}
            isNegative={result.totalFeesPaid > 0}
          />
        )}
      </div>
    </div>
  );
}
