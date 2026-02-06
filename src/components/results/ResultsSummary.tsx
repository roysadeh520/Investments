import type { CalculationResults } from '../../types/results';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { INVESTMENT_LABELS, INVESTMENT_COLORS } from '../../constants/defaults';

interface Props {
  results: CalculationResults;
}

export default function ResultsSummary({ results }: Props) {
  const activeResults = Object.entries(results).filter(([, r]) => r !== undefined);

  if (activeResults.length === 0) return null;

  const rows = [
    { label: 'סה"כ הפקדות / השקעה', key: 'totalContributions' as const },
    { label: 'ערך ברוטו', key: 'grossFinalValue' as const },
    { label: 'רווח ברוטו', key: 'grossProfit' as const, colored: true },
    { label: 'מס', key: 'taxAmount' as const, negative: true },
    { label: 'רווח נטו', key: 'netProfit' as const, colored: true, bold: true },
    { label: 'כוח קנייה ריאלי (רווח)', key: 'realProfit' as const, colored: true },
    { label: 'תשואה שנתית', key: 'annualizedReturn' as const, isPercent: true },
  ];

  return (
    <div className="card overflow-hidden">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>📊</span>
        טבלת השוואה
      </h3>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-right text-sm font-semibold text-gray-600 dark:text-gray-400 py-3 px-6">
                מדד
              </th>
              {activeResults.map(([key]) => (
                <th
                  key={key}
                  className="text-center text-sm font-bold py-3 px-4"
                  style={{ color: INVESTMENT_COLORS[key] }}
                >
                  {INVESTMENT_LABELS[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className={`text-right text-sm py-3 px-6 ${row.bold ? 'font-bold text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                  {row.label}
                </td>
                {activeResults.map(([key, result]) => {
                  const value = result![row.key as keyof typeof result] as number;
                  const isPositive = value > 0;
                  const isNeg = value < 0;

                  let displayValue: string;
                  if (row.isPercent) {
                    displayValue = formatPercent(value);
                  } else {
                    displayValue = formatCurrency(value);
                  }

                  let colorClass = '';
                  if (row.colored || row.negative) {
                    if (row.negative) {
                      colorClass = value > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500';
                    } else {
                      colorClass = isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : isNeg
                        ? 'text-red-600 dark:text-red-400'
                        : '';
                    }
                  }

                  return (
                    <td
                      key={key}
                      className={`text-center text-sm py-3 px-4 ${row.bold ? 'font-bold text-base' : ''} ${colorClass}`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
