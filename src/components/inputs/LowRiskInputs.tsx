import type { LowRiskInputs as LowRiskInputsType } from '../../types/investments';
import SectionCard from '../common/SectionCard';
import NumberInput from '../common/NumberInput';
import PercentInput from '../common/PercentInput';
import ToggleSwitch from '../common/ToggleSwitch';
import { TOOLTIPS } from '../../constants/tooltips';
import { INVESTMENT_COLORS } from '../../constants/defaults';

interface Props {
  values: LowRiskInputsType;
  onChange: (values: LowRiskInputsType) => void;
}

export default function LowRiskInputs({ values, onChange }: Props) {
  const update = <K extends keyof LowRiskInputsType>(key: K, val: LowRiskInputsType[K]) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <SectionCard title="סיכון נמוך (אג״ח / קרן כספית)" icon="🛡️" color={INVESTMENT_COLORS.lowRisk}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          label="השקעה ראשונית"
          value={values.initialInvestment}
          onChange={(v) => update('initialInvestment', v)}
          tooltip={TOOLTIPS.lowRisk_initialInvestment}
          min={0}
        />
        <NumberInput
          label="הפקדה חודשית"
          value={values.monthlyContribution}
          onChange={(v) => update('monthlyContribution', v)}
          tooltip={TOOLTIPS.lowRisk_monthlyContribution}
          min={0}
        />
        <PercentInput
          label="תשואה שנתית ממוצעת"
          value={values.annualReturn}
          onChange={(v) => update('annualReturn', v)}
          tooltip={TOOLTIPS.lowRisk_annualReturn}
          min={0}
          max={20}
          step={0.1}
        />
        <PercentInput
          label="דמי ניהול שנתיים"
          value={values.managementFeePercent}
          onChange={(v) => update('managementFeePercent', v)}
          tooltip={TOOLTIPS.lowRisk_managementFeePercent}
          min={0}
          max={3}
          step={0.01}
        />
        <div className="sm:col-span-2">
          <ToggleSwitch
            label="צמוד מדד (תשואה ריאלית)"
            checked={values.isCPILinked}
            onChange={(v) => update('isCPILinked', v)}
            tooltip={TOOLTIPS.lowRisk_isCPILinked}
          />
        </div>
      </div>
    </SectionCard>
  );
}
