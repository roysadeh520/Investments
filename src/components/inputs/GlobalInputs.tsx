import type { GlobalInputs as GlobalInputsType } from '../../types/investments';
import PercentInput from '../common/PercentInput';
import NumberInput from '../common/NumberInput';
import SelectInput from '../common/SelectInput';
import { TOOLTIPS } from '../../constants/tooltips';

interface GlobalInputsProps {
  values: GlobalInputsType;
  onChange: (values: GlobalInputsType) => void;
}

export default function GlobalInputs({ values, onChange }: GlobalInputsProps) {
  const update = <K extends keyof GlobalInputsType>(key: K, val: GlobalInputsType[K]) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <div className="card">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <span className="text-xl">⚙️</span>
        הגדרות כלליות
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PercentInput
          label="אינפלציה שנתית ממוצעת"
          value={values.inflationRate}
          onChange={(v) => update('inflationRate', v)}
          tooltip={TOOLTIPS.inflationRate}
          min={0}
          max={20}
          step={0.1}
        />
        <NumberInput
          label="מספר שנים"
          value={values.years}
          onChange={(v) => update('years', Math.max(1, Math.round(v)))}
          tooltip={TOOLTIPS.years}
          prefix=""
          min={1}
          max={50}
          step={1}
        />
        <SelectInput
          label="סטטוס מס רווחי הון"
          value={values.taxBracket}
          onChange={(v) => update('taxBracket', v as 'standard' | 'significant')}
          tooltip={TOOLTIPS.taxBracket}
          options={[
            { value: 'standard', label: 'רגיל (25%)' },
            { value: 'significant', label: 'בעל מניות מהותי (30%)' },
          ]}
        />
      </div>
    </div>
  );
}
