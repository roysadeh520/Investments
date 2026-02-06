import { RISK_LEVELS, INVESTMENT_LABELS } from '../../constants/defaults';
import type { InvestmentType } from '../../types/investments';

interface Props {
  activeInvestments: InvestmentType[];
}

export default function RiskIndicator({ activeInvestments }: Props) {
  if (activeInvestments.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>⚠️</span>
        מד סיכון
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {activeInvestments.map((type) => {
          const risk = RISK_LEVELS[type];
          const label = INVESTMENT_LABELS[type];

          // Risk level as a percentage for the bar
          const riskMap: Record<string, number> = {
            'אפסי': 5,
            'נמוך': 25,
            'בינוני': 55,
            'גבוה': 85,
          };
          const riskPercent = riskMap[risk.level] || 50;

          return (
            <div key={type} className="text-center">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</div>
              <div className="relative h-3 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 right-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${riskPercent}%`,
                    background: `linear-gradient(to left, ${risk.color}, ${risk.color}80)`,
                  }}
                />
              </div>
              <div
                className="text-xs font-bold mt-1"
                style={{ color: risk.color }}
              >
                {risk.level}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
