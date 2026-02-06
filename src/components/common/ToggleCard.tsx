interface ToggleCardProps {
  label: string;
  icon: string;
  isActive: boolean;
  color: string;
  riskLevel: string;
  riskColor: string;
  onToggle: () => void;
}

export default function ToggleCard({
  label, icon, isActive, color, riskLevel, riskColor, onToggle,
}: ToggleCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
        hover:shadow-md cursor-pointer min-w-[120px] flex-1
        ${isActive
          ? 'border-current shadow-md scale-[1.02]'
          : 'border-gray-200 dark:border-slate-700 opacity-60 hover:opacity-80'
        }
        bg-white dark:bg-slate-800
      `}
      style={{ color: isActive ? color : undefined }}
    >
      <span className="text-3xl">{icon}</span>
      <span className={`font-bold text-sm ${isActive ? '' : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </span>
      <span
        className="text-[10px] font-medium px-2 py-0.5 rounded-full"
        style={{
          backgroundColor: isActive ? `${riskColor}20` : '#6b728020',
          color: isActive ? riskColor : '#6b7280',
        }}
      >
        סיכון {riskLevel}
      </span>
      {isActive && (
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
          style={{ backgroundColor: color }}
        >
          ✓
        </div>
      )}
    </button>
  );
}
