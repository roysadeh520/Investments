import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import type { CalculationResults } from '../../types/results';
import { INVESTMENT_LABELS, INVESTMENT_COLORS } from '../../constants/defaults';
import { formatCompactCurrency } from '../../utils/formatters';

interface Props {
  results: CalculationResults;
}

export default function ResultsChart({ results }: Props) {
  const activeResults = Object.entries(results).filter(([, r]) => r !== undefined);
  if (activeResults.length === 0) return null;

  const data = activeResults.map(([key, result]) => ({
    name: INVESTMENT_LABELS[key],
    key,
    grossProfit: result!.grossProfit,
    netProfit: result!.netProfit,
    realProfit: result!.realProfit,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>📊</span>
        השוואת רווחים
      </h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => formatCompactCurrency(v)}
              tick={{ fontSize: 11 }}
              width={80}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  grossProfit: 'רווח ברוטו',
                  netProfit: 'רווח נטו',
                  realProfit: 'רווח ריאלי',
                };
                return [formatCompactCurrency(value), labels[name] || name];
              }}
              contentStyle={{
                borderRadius: '8px',
                direction: 'rtl',
              }}
            />
            <Legend
              formatter={(value) => {
                const labels: Record<string, string> = {
                  grossProfit: 'רווח ברוטו',
                  netProfit: 'רווח נטו',
                  realProfit: 'רווח ריאלי',
                };
                return labels[value] || value;
              }}
              wrapperStyle={{ direction: 'rtl' }}
            />
            <Bar dataKey="grossProfit" fill="#93c5fd" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={`${INVESTMENT_COLORS[entry.key]}40`} />
              ))}
            </Bar>
            <Bar dataKey="netProfit" fill="#60a5fa" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={`${INVESTMENT_COLORS[entry.key]}80`} />
              ))}
            </Bar>
            <Bar dataKey="realProfit" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={INVESTMENT_COLORS[entry.key]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
