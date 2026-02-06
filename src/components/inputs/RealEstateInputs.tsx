import type { RealEstateInputs as RealEstateInputsType } from '../../types/investments';
import SectionCard from '../common/SectionCard';
import NumberInput from '../common/NumberInput';
import PercentInput from '../common/PercentInput';
import SelectInput from '../common/SelectInput';
import ToggleSwitch from '../common/ToggleSwitch';
import { TOOLTIPS } from '../../constants/tooltips';
import { INVESTMENT_COLORS } from '../../constants/defaults';
import { formatCurrency } from '../../utils/formatters';

interface Props {
  values: RealEstateInputsType;
  onChange: (values: RealEstateInputsType) => void;
}

export default function RealEstateInputs({ values, onChange }: Props) {
  const update = <K extends keyof RealEstateInputsType>(key: K, val: RealEstateInputsType[K]) => {
    onChange({ ...values, [key]: val });
  };

  const mortgageAmount = values.apartmentPrice * (values.mortgagePercent / 100);
  const downPaymentAmount = values.apartmentPrice - mortgageAmount;

  return (
    <SectionCard title="דירה" icon="🏠" color={INVESTMENT_COLORS.realEstate}>
      <div className="space-y-6">
        {/* Property */}
        <div>
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">נתוני הנכס</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="מחיר הדירה"
              value={values.apartmentPrice}
              onChange={(v) => update('apartmentPrice', v)}
              tooltip={TOOLTIPS.re_apartmentPrice}
              min={0}
            />
            <PercentInput
              label="עליית ערך שנתית צפויה"
              value={values.annualAppreciation}
              onChange={(v) => update('annualAppreciation', v)}
              tooltip={TOOLTIPS.re_annualAppreciation}
              min={-20}
              max={30}
              step={0.5}
            />
          </div>
        </div>

        {/* Mortgage */}
        <div>
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">משכנתא</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <PercentInput
                label="אחוז מימון (משכנתא)"
                value={values.mortgagePercent}
                onChange={(v) => update('mortgagePercent', v)}
                tooltip={TOOLTIPS.re_mortgagePercent}
                min={0}
                max={75}
                step={5}
              />
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                <div>הון עצמי: {formatCurrency(downPaymentAmount)}</div>
                <div>סכום משכנתא: {formatCurrency(mortgageAmount)}</div>
              </div>
            </div>
            <NumberInput
              label="שנות משכנתא"
              value={values.mortgageYears}
              onChange={(v) => update('mortgageYears', Math.max(1, Math.min(30, Math.round(v))))}
              tooltip={TOOLTIPS.re_mortgageYears}
              prefix=""
              min={1}
              max={30}
            />
            <PercentInput
              label="ריבית שנתית (לא צמודה - קל״צ)"
              value={values.mortgageInterestRate}
              onChange={(v) => update('mortgageInterestRate', v)}
              tooltip={TOOLTIPS.re_mortgageInterestRate}
              min={0}
              max={15}
              step={0.1}
            />
            <PercentInput
              label="אחוז צמוד מדד מהמשכנתא"
              value={values.cpiLinkedPercent}
              onChange={(v) => update('cpiLinkedPercent', v)}
              tooltip={TOOLTIPS.re_cpiLinkedPercent}
              min={0}
              max={100}
              step={1}
            />
            {values.cpiLinkedPercent > 0 && (
              <>
                <PercentInput
                  label="ריבית צמוד מדד"
                  value={values.cpiLinkedInterestRate}
                  onChange={(v) => update('cpiLinkedInterestRate', v)}
                  tooltip={TOOLTIPS.re_cpiLinkedInterestRate}
                  min={0}
                  max={15}
                  step={0.1}
                />
                <NumberInput
                  label="שנות מסלול צמוד מדד"
                  value={values.cpiLinkedYears}
                  onChange={(v) => update('cpiLinkedYears', Math.max(1, Math.min(30, Math.round(v))))}
                  tooltip={TOOLTIPS.re_cpiLinkedYears}
                  prefix=""
                  min={1}
                  max={30}
                />
              </>
            )}
          </div>
        </div>

        {/* Rental Income */}
        <div>
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">הכנסה משכירות</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="שכירות חודשית"
              value={values.monthlyRent}
              onChange={(v) => update('monthlyRent', v)}
              tooltip={TOOLTIPS.re_monthlyRent}
              min={0}
            />
            <PercentInput
              label="עליית שכירות שנתית"
              value={values.annualRentIncrease}
              onChange={(v) => update('annualRentIncrease', v)}
              tooltip={TOOLTIPS.re_annualRentIncrease}
              min={0}
              max={20}
              step={0.5}
            />
            <PercentInput
              label="תקופות ללא שוכר"
              value={values.vacancyRatePercent}
              onChange={(v) => update('vacancyRatePercent', v)}
              tooltip={TOOLTIPS.re_vacancyRatePercent}
              min={0}
              max={50}
              step={1}
            />
            <SelectInput
              label="מסלול מס שכירות"
              value={values.rentalTaxTrack}
              onChange={(v) => update('rentalTaxTrack', v as 'none' | 'exempt' | '10percent' | 'marginal')}
              tooltip={TOOLTIPS.re_rentalTaxTrack}
              options={[
                { value: 'none', label: 'ללא מס (0%)' },
                { value: '10percent', label: '10% מס ברוטו' },
                { value: 'exempt', label: 'פטור (עד 5,654 ₪/חודש)' },
                { value: 'marginal', label: 'מס שולי' },
              ]}
            />
          </div>
        </div>

        {/* Costs */}
        <div>
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">עלויות</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="תחזוקה שנתית"
              value={values.annualMaintenanceCost}
              onChange={(v) => update('annualMaintenanceCost', v)}
              tooltip={TOOLTIPS.re_annualMaintenanceCost}
              min={0}
            />
            <NumberInput
              label="ביטוח דירה שנתי"
              value={values.annualInsurance}
              onChange={(v) => update('annualInsurance', v)}
              tooltip={TOOLTIPS.re_annualInsurance}
              min={0}
            />
            <PercentInput
              label='עמלת עו"ד ומתווך'
              value={values.lawyerAndAgentPercent}
              onChange={(v) => update('lawyerAndAgentPercent', v)}
              tooltip={TOOLTIPS.re_lawyerAndAgentPercent}
              min={0}
              max={10}
              step={0.5}
            />
            <NumberInput
              label="עלות שיפוץ"
              value={values.renovationCost}
              onChange={(v) => update('renovationCost', v)}
              tooltip={TOOLTIPS.re_renovationCost}
              min={0}
            />
            <div className="sm:col-span-2">
              <ToggleSwitch
                label="דירה יחידה (משפיע על מס רכישה)"
                checked={values.isFirstApartment}
                onChange={(v) => update('isFirstApartment', v)}
                tooltip={TOOLTIPS.re_isFirstApartment}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
