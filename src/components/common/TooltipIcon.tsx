import { useState, useRef, useEffect } from 'react';
import { HiQuestionMarkCircle } from 'react-icons/hi2';

interface TooltipIconProps {
  text: string;
}

export default function TooltipIcon({ text }: TooltipIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
          iconRef.current && !iconRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <span className="relative inline-flex items-center mr-1">
      <button
        ref={iconRef}
        type="button"
        className="text-gray-400 hover:text-primary-500 dark:text-gray-500 dark:hover:text-primary-400 transition-colors focus:outline-none"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="מידע נוסף"
      >
        <HiQuestionMarkCircle className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bottom-full mb-2 right-0 w-64 p-3 text-sm leading-relaxed bg-gray-900 dark:bg-gray-700 text-white rounded-lg shadow-xl"
          role="tooltip"
        >
          {text}
          <div className="absolute -bottom-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
        </div>
      )}
    </span>
  );
}
