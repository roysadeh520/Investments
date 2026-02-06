import ThemeToggle from '../features/ThemeToggle';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function AppHeader({ isDark, onToggleTheme }: Props) {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            <span>💰</span>
            השוואת השקעות
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            השווה בין אפיקי השקעה שונים וגלה מה הכי משתלם עבורך
          </p>
        </div>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
}
