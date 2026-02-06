import type { StockMarketInputs as StockMarketInputsType } from '../../types/investments';
import SectionCard from '../common/SectionCard';
import NumberInput from '../common/NumberInput';
import PercentInput from '../common/PercentInput';
import { TOOLTIPS } from '../../constants/tooltips';
import { INVESTMENT_COLORS } from '../../constants/defaults';

interface Props {
  values: StockMarketInputsType;
  onChange: (values: StockMarketInputsType) => void;
}

export default function StockMarketInputs({ values, onChange }: Props) {
  const update = <K extends keyof StockMarketInputsType>(key: K, val: StockMarketInputsType[K]) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <SectionCard title="בורסה" icon="📈" color={INVESTMENT_COLORS.stockMarket}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          label="השקעה ראשונית"
          value={values.initialInvestment}
          onChange={(v) => update('initialInvestment', v)}
          tooltip={TOOLTIPS.stock_initialInvestment}
          min={0}
        />
        <NumberInput
          label="הפקדה חודשית"
          value={values.monthlyContribution}
          onChange={(v) => update('monthlyContribution', v)}
          tooltip={TOOLTIPS.stock_monthlyContribution}
          min={0}
        />
        <PercentInput
          label="תשואה שנתית ממוצעת"
          value={values.annualReturn}
          onChange={(v) => update('annualReturn', v)}
          tooltip={TOOLTIPS.stock_annualReturn}
          min={-50}
          max={50}
          step={0.5}
        />
        <PercentInput
          label="דמי ניהול שנתיים"
          value={values.managementFeePercent}
          onChange={(v) => update('managementFeePercent', v)}
          tooltip={TOOLTIPS.stock_managementFeePercent}
          min={0}
          max={5}
          step={0.05}
        />
      </div>
    </SectionCard>
  );
}
