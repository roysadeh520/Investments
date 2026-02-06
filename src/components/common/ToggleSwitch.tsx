import TooltipIcon from './TooltipIcon';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

export default function ToggleSwitch({ label, checked, onChange, tooltip }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="label flex items-center gap-1 mb-0">
        {label}
        {tooltip && <TooltipIcon text={tooltip} />}
      </label>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          ${checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-slate-600'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200
            ${checked ? 'translate-x-1.5' : 'translate-x-6'}
          `}
        />
      </button>
    </div>
  );
}
