export default function AppFooter() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            ⚠️ הבהרה חשובה
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 leading-relaxed">
            מחשבון זה מיועד להערכה בלבד ואינו מהווה ייעוץ השקעות, ייעוץ מס, או המלצה פיננסית.
            התוצאות מבוססות על הנחות ואינן מבטיחות תשואה בפועל.
            יש להתייעץ עם יועץ מס ויועץ השקעות מוסמך לפני קבלת החלטות פיננסיות.
            שיעורי המס עשויים להשתנות בהתאם לחקיקה עדכנית.
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          השוואת השקעות &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
