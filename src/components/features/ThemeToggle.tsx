import { HiSun, HiMoon } from 'react-icons/hi2';

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ isDark, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
      aria-label={isDark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
    >
      {isDark ? (
        <HiSun className="w-5 h-5 text-amber-400" />
      ) : (
        <HiMoon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}
