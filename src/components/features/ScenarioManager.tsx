import { useState } from 'react';
import type { AppState } from '../../types/investments';
import type { Scenario } from '../../types/results';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { HiBookmark, HiTrash, HiArrowDownTray } from 'react-icons/hi2';

interface Props {
  currentState: AppState;
  onLoad: (state: AppState) => void;
}

export default function ScenarioManager({ currentState, onLoad }: Props) {
  const [scenarios, setScenarios] = useLocalStorage<Scenario[]>('investment-scenarios', []);
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');

  const handleSave = () => {
    if (!name.trim()) return;

    const newScenario: Scenario = {
      id: Date.now().toString(),
      name: name.trim(),
      createdAt: Date.now(),
      state: currentState,
    };

    setScenarios((prev) => [...prev, newScenario]);
    setName('');
    setShowSave(false);
  };

  const handleDelete = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const handleLoad = (scenario: Scenario) => {
    onLoad(scenario.state);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <HiBookmark className="text-primary-500" />
          תרחישים שמורים
        </h3>
        <button
          onClick={() => setShowSave(!showSave)}
          className="btn-secondary text-sm"
        >
          {showSave ? 'ביטול' : '+ שמור תרחיש'}
        </button>
      </div>

      {showSave && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='שם התרחיש (לדוגמה: "שמרני", "אגרסיבי")'
            className="input-field flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="btn-primary text-sm py-2"
          >
            שמור
          </button>
        </div>
      )}

      {scenarios.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          אין תרחישים שמורים. שמור תרחיש כדי לחזור אליו מאוחר יותר.
        </p>
      ) : (
        <div className="space-y-2">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3"
            >
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-200">{scenario.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(scenario.createdAt).toLocaleDateString('he-IL')}
                  {' · '}
                  {scenario.state.activeInvestments.length} סוגי השקעות
                  {' · '}
                  {scenario.state.globalInputs.years} שנים
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLoad(scenario)}
                  className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors"
                  title="טען תרחיש"
                >
                  <HiArrowDownTray className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(scenario.id)}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                  title="מחק תרחיש"
                >
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
