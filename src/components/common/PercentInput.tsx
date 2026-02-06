import TooltipIcon from './TooltipIcon';

interface PercentInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export default function PercentInput({
  label, value, onChange, tooltip,
  min = 0, max = 100, step = 0.1, disabled = false,
}: PercentInputProps) {
  return (
    <div className="space-y-1">
      <label className="label flex items-center gap-1">
        {label}
        {tooltip && <TooltipIcon text={tooltip} />}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="input-field pl-8"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none">
          %
        </span>
      </div>
    </div>
  );
}
