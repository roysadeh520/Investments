import { useState, useEffect } from 'react';
import TooltipIcon from './TooltipIcon';
import { formatNumber, parseCurrencyInput } from '../../utils/formatters';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string;
  suffix?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function NumberInput({
  label, value, onChange, tooltip, suffix, prefix = '₪',
  min, max, step = 1, disabled = false, readOnly = false,
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseCurrencyInput(displayValue);
    const clamped = Math.min(Math.max(parsed, min ?? -Infinity), max ?? Infinity);
    onChange(clamped);
    setDisplayValue(formatNumber(clamped));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };

  return (
    <div className="space-y-1">
      <label className="label flex items-center gap-1">
        {label}
        {tooltip && <TooltipIcon text={tooltip} />}
      </label>
      <div className="relative">
        {prefix && !suffix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="numeric"
          value={readOnly ? formatNumber(value) : displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          readOnly={readOnly}
          step={step}
          className={`input-field ${prefix && !suffix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''} ${readOnly ? 'bg-gray-100 dark:bg-slate-600 cursor-not-allowed' : ''}`}
        />
        {suffix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
