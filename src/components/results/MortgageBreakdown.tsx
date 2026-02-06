import type { RealEstateResult } from '../../types/results';
import ResultCard from '../common/ResultCard';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  result: RealEstateResult;
}

export default function MortgageBreakdown({ result }: Props) {
  const { mortgage } = result;

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span>🏦</span>
        פירוט משכנתא ונדל"ן
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <ResultCard
          label="הון עצמי (מקדמה)"
          value={formatCurrency(result.downPayment)}
        />
        <ResultCard
          label="מס רכישה"
          value={formatCurrency(result.purchaseTax)}
          isNegative={result.purchaseTax > 0}
        />
        <ResultCard
          label="עלויות ראשוניות"
          value={formatCurrency(result.totalUpfrontCosts)}
          subValue='(מקדמה + מס + עו"ד + מתווך + שיפוץ)'
        />
        <ResultCard
          label="החזר חודשי (התחלתי)"
          value={formatCurrency(mortgage.initialMonthlyPayment)}
          subValue={`קל"צ: ${formatCurrency(mortgage.nonLinkedPayment)} | צמוד: ${formatCurrency(mortgage.cpiLinkedPayment)}`}
        />
        {mortgage.finalMonthlyPayment > 0 && (
          <ResultCard
            label="החזר חודשי (סוף תקופה)"
            value={formatCurrency(mortgage.finalMonthlyPayment)}
            subValue="(כולל עליית צמוד מדד)"
          />
        )}
        <ResultCard
          label="סה״כ תשלומי משכנתא"
          value={formatCurrency(mortgage.totalPaid)}
        />
        <ResultCard
          label="סה״כ ריבית"
          value={formatCurrency(mortgage.totalInterest)}
          isNegative
        />
        <ResultCard
          label="שווי דירה עתידי"
          value={formatCurrency(result.futurePropertyValue)}
          isPositive
        />
        <ResultCard
          label="יתרת משכנתא"
          value={formatCurrency(result.remainingMortgage)}
          isNegative={result.remainingMortgage > 0}
        />
        <ResultCard
          label="הון עצמי (אקוויטי)"
          value={formatCurrency(result.equity)}
          isPositive={result.equity > 0}
          large
        />
        <ResultCard
          label="הכנסות שכירות (ברוטו)"
          value={formatCurrency(result.totalRentalIncome)}
          isPositive
        />
        <ResultCard
          label="הכנסות שכירות (נטו)"
          value={formatCurrency(result.netRentalIncome)}
          subValue="(אחרי מס ותחזוקה)"
          isPositive={result.netRentalIncome > 0}
          isNegative={result.netRentalIncome < 0}
        />
      </div>
    </div>
  );
}
