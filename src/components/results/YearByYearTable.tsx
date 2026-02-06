import { useState } from 'react';
import type { CalculationResults } from '../../types/results';
import { formatCurrency } from '../../utils/formatters';
import { INVESTMENT_LABELS, INVESTMENT_COLORS } from '../../constants/defaults';
import { HiChevronDown } from 'react-icons/hi2';

interface Props {
  results: CalculationResults;
}

export default function YearByYearTable({ results }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const activeResults = Object.entries(results).filter(([, r]) => r !== undefined);

  if (activeResults.length === 0) return null;

  const maxYears = Math.max(...activeResults.map(([, r]) => r!.yearlyData.length)) - 1;

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 cursor-pointer"
      >
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <span>📋</span>
          טבלת נתונים שנתית
        </h3>
        <HiChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-4 overflow-x-auto -mx-6">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="text-right py-2 px-4 font-semibold text-gray-600 dark:text-gray-400">שנה</th>
                {activeResults.map(([key]) => (
                  <th
                    key={key}
                    className="text-center py-2 px-4 font-bold"
                    style={{ color: INVESTMENT_COLORS[key] }}
                    colSpan={2}
                  >
                    {INVESTMENT_LABELS[key]}
                    <div className="flex text-[10px] font-normal text-gray-400 mt-1">
                      <span className="flex-1">נומינלי</span>
                      <span className="flex-1">ריאלי</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxYears + 1 }, (_, year) => (
                <tr
                  key={year}
                  className={`border-b border-gray-50 dark:border-slate-700/30 ${year % 5 === 0 ? 'bg-gray-50 dark:bg-slate-700/20' : ''}`}
                >
                  <td className="text-right py-2 px-4 font-medium text-gray-700 dark:text-gray-300">{year}</td>
                  {activeResults.map(([key, result]) => {
                    const yd = result!.yearlyData[year];
                    return (
                      <td key={key} className="text-center py-2 px-2" colSpan={2}>
                        {yd ? (
                          <div className="flex text-xs">
                            <span className="flex-1">{formatCurrency(yd.nominalValue)}</span>
                            <span className="flex-1 text-gray-500 dark:text-gray-400">{formatCurrency(yd.realValue)}</span>
                          </div>
                        ) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
