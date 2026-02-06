import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { BreakEvenData } from '../../types/results';
import { formatCompactCurrency } from '../../utils/formatters';
import { INVESTMENT_COLORS } from '../../constants/defaults';

interface Props {
  data: BreakEvenData[];
}

export default function BreakEvenChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  const breakEvenYear = data[data.length - 1]?.breakEvenYear;

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
        <span>🎯</span>
        ניתוח איזון - בורסה מול דירה
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {breakEvenYear
          ? `נקודת האיזון: לאחר ${breakEvenYear} שנים הדירה מתחילה להיות רווחית יותר מהבורסה`
          : 'בטווח הזמן הנבחר, הבורסה רווחית יותר מהדירה'}
      </p>
      <div className="h-[300px]">
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
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  stockValue: 'בורסה',
                  realEstateValue: 'דירה',
                };
                return [formatCompactCurrency(value), labels[name] || name];
              }}
              labelFormatter={(label) => `שנה ${label}`}
              contentStyle={{ borderRadius: '8px', direction: 'rtl' }}
            />
            <Legend
              formatter={(value) => {
                const labels: Record<string, string> = {
                  stockValue: 'רווח בורסה (נטו)',
                  realEstateValue: 'רווח דירה (נטו)',
                };
                return labels[value] || value;
              }}
              wrapperStyle={{ direction: 'rtl' }}
            />
            {breakEvenYear && (
              <ReferenceLine
                x={breakEvenYear}
                stroke="#ef4444"
                strokeDasharray="5 5"
                label={{ value: `נקודת איזון (${breakEvenYear} שנים)`, fill: '#ef4444', fontSize: 11 }}
              />
            )}
            <Line
              type="monotone"
              dataKey="stockValue"
              stroke={INVESTMENT_COLORS.stockMarket}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="realEstateValue"
              stroke={INVESTMENT_COLORS.realEstate}
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
