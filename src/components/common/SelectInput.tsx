import TooltipIcon from './TooltipIcon';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  tooltip?: string;
}

export default function SelectInput({ label, value, onChange, options, tooltip }: SelectInputProps) {
  return (
    <div className="space-y-1">
      <label className="label flex items-center gap-1">
        {label}
        {tooltip && <TooltipIcon text={tooltip} />}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
