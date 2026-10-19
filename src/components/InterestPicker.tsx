import React from 'react';
import { ALL_INTEREST_TOPICS } from '../data/mockData';
import { Sparkles, Check, RefreshCw } from 'lucide-react';

interface InterestPickerProps {
  userInterests: string[];
  onToggleInterest: (topic: string) => void;
  onResetInterests?: () => void;
  matchedCirclesCount: number;
}

export const InterestPicker: React.FC<InterestPickerProps> = ({
  userInterests,
  onToggleInterest,
  onResetInterests,
  matchedCirclesCount,
}) => {
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              Minat & Topik Pilihan Kamu
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sistem merekomendasikan Circle aktif berdasar topik yang kamu aktifkan di bawah ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 font-medium">
            <span className="font-semibold text-indigo-600 font-mono tabular-nums">{matchedCirclesCount}</span> Circle relevan
          </span>
          {onResetInterests && userInterests.length > 0 && (
            <button
              onClick={onResetInterests}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              title="Reset ke default"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Interest Selector Buttons (Functional interactive button controls) */}
      <div className="flex flex-wrap gap-2">
        {ALL_INTEREST_TOPICS.map((topic) => {
          const isSelected = userInterests.includes(topic);
          return (
            <button
              key={topic}
              onClick={() => onToggleInterest(topic)}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {isSelected ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              )}
              <span>{topic}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
