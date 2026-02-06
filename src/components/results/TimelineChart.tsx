import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { CalculationResults } from '../../types/results';
import { INVESTMENT_LABELS, INVESTMENT_COLORS } from '../../constants/defaults';
import { formatCompactCurrency } from '../../utils/formatters';

interface Props {
  results: CalculationResults;
  showReal?: boolean;
}

export default function TimelineChart({ results, showReal = false }: Props) {
  const activeResults = Object.entries(results).filter(([, r]) => r !== undefined);
  if (activeResults.length === 0) return null;

  // Build merged data
  const maxYears = Math.max(...activeResults.map(([, r]) => r!.yearlyData.length)) - 1;
  const data = [];

  for (let year = 0; year <= maxYears; year++) {
    const point: Record<string, number> = { year };
    for (const [key, result] of activeResults) {
      const yd = result!.yearlyData[year];
      if (yd) {
        point[key] = showReal ? yd.realValue : yd.nominalValue;
      }
    }
    data.push(point);
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>📈</span>
        {showReal ? 'צמיחה לאורך זמן (ערך ריאלי)' : 'צמיחה לאורך זמן (נומינלי)'}
      </h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              label={{ value: 'שנים', position: 'insideBottom', offset: -5 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(v) => formatCompactCurrency(v)}
              tick={{ fontSize: 11 }}
              width={80}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatCompactCurrency(value),
                INVESTMENT_LABELS[name] || name,
              ]}
              labelFormatter={(label) => `שנה ${label}`}
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #fff)',
                borderColor: 'var(--tooltip-border, #e5e7eb)',
                borderRadius: '8px',
                direction: 'rtl',
              }}
            />
            <Legend
              formatter={(value) => INVESTMENT_LABELS[value] || value}
              wrapperStyle={{ direction: 'rtl' }}
            />
            {activeResults.map(([key]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={INVESTMENT_COLORS[key]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
