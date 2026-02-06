interface ResultCardProps {
  label: string;
  value: string;
  subValue?: string;
  isPositive?: boolean;
  isNegative?: boolean;
  large?: boolean;
}

export default function ResultCard({
  label, value, subValue, isPositive, isNegative, large = false,
}: ResultCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </div>
      <div
        className={`font-bold ${large ? 'text-2xl' : 'text-lg'} ${
          isPositive ? 'profit-positive' : isNegative ? 'profit-negative' : 'text-gray-900 dark:text-gray-100'
        }`}
      >
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {subValue}
        </div>
      )}
    </div>
  );
}
