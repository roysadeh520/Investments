import type { CheckingAccountInputs as CheckingAccountInputsType } from '../../types/investments';
import SectionCard from '../common/SectionCard';
import NumberInput from '../common/NumberInput';
import PercentInput from '../common/PercentInput';
import { TOOLTIPS } from '../../constants/tooltips';
import { INVESTMENT_COLORS } from '../../constants/defaults';

interface Props {
  values: CheckingAccountInputsType;
  onChange: (values: CheckingAccountInputsType) => void;
}

export default function CheckingAccountInputs({ values, onChange }: Props) {
  const update = <K extends keyof CheckingAccountInputsType>(key: K, val: CheckingAccountInputsType[K]) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <SectionCard title='עו"ש' icon="🏦" color={INVESTMENT_COLORS.checkingAccount}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <NumberInput
          label='סכום בעו"ש'
          value={values.amount}
          onChange={(v) => update('amount', v)}
          tooltip={TOOLTIPS.checking_amount}
          min={0}
        />
        <PercentInput
          label="ריבית שנתית"
          value={values.annualInterest}
          onChange={(v) => update('annualInterest', v)}
          tooltip={TOOLTIPS.checking_annualInterest}
          min={0}
          max={20}
          step={0.1}
        />
      </div>
    </SectionCard>
  );
}
