import type { OpportunityCostResult } from '../../types/results';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  data: OpportunityCostResult;
}

export default function OpportunityCost({ data }: Props) {
  const isBetter = data.betterOption === 'realEstate';

  return (
    <div className="card border-2 border-dashed border-amber-300 dark:border-amber-600">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>🤔</span>
        עלות אלטרנטיבית - מה אם ההון היה מושקע בבורסה?
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        חישוב של מה היה קורה אם במקום לקנות דירה, היית משקיע את ההון העצמי ועלויות הרכישה בבורסה,
        ואת ההפרש בין החזר המשכנתא להכנסה מהשכירות היית מפקיד מדי חודש.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1">רווח מדירה (נטו)</div>
          <div className="text-xl font-bold text-amber-700 dark:text-amber-300">
            {formatCurrency(data.realEstateTotalReturn)}
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">רווח מבורסה (אלטרנטיבי)</div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
            {formatCurrency(data.alternativeProfit)}
          </div>
        </div>
        <div className={`rounded-lg p-4 text-center ${isBetter ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
          <div className={`text-xs font-medium mb-1 ${isBetter ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            הפרש
          </div>
          <div className={`text-xl font-bold ${isBetter ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {formatCurrency(Math.abs(data.difference))}
            <span className="text-sm mr-1">
              {isBetter ? 'לטובת הדירה' : 'לטובת הבורסה'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
