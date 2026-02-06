import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';

interface SectionCardProps {
  title: string;
  icon?: string;
  color?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function SectionCard({
  title, icon, color, defaultOpen = true, children,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-3 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3
            className="text-lg font-bold"
            style={color ? { color } : undefined}
          >
            {title}
          </h3>
        </div>
        <HiChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}
