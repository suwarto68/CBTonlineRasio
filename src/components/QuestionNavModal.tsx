import React from 'react';
import { Question, UserAnswer } from '../types';
import { X, CheckCircle2, HelpCircle, Circle } from 'lucide-react';

interface QuestionNavModalProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, UserAnswer>;
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion: (index: number) => void;
}

export const QuestionNavModal: React.FC<QuestionNavModalProps> = ({
  questions,
  currentIndex,
  answers,
  isOpen,
  onClose,
  onSelectQuestion
}) => {
  if (!isOpen) return null;

  // Calculate statistics
  let answeredCount = 0;
  let doubtfulCount = 0;
  let unansweredCount = 0;

  questions.forEach((q) => {
    const ans = answers[q.id];
    if (ans?.isDoubtful) {
      doubtfulCount++;
    } else if (
      ans?.selectedOption ||
      (ans?.selectedComplexOptions && ans.selectedComplexOptions.length > 0) ||
      (ans?.trueFalseAnswers && Object.keys(ans.trueFalseAnswers).length > 0)
    ) {
      answeredCount++;
    } else {
      unansweredCount++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-[#0f4c81] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">DAFTAR SOAL UJIAN</span>
            <span className="text-xs bg-blue-900/80 text-blue-200 font-mono px-2 py-0.5 rounded">
              Total {questions.length} Butir Soal
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded hover:bg-blue-900/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Legend */}
        <div className="bg-slate-100 p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-4 h-4 rounded bg-emerald-600 border border-emerald-700 inline-block shadow-xs" />
              <span>Sudah Dijawab ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-4 h-4 rounded bg-amber-400 border border-amber-500 inline-block shadow-xs" />
              <span>Ragu-ragu ({doubtfulCount})</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-4 h-4 rounded bg-white border border-slate-400 inline-block shadow-xs" />
              <span>Belum Dijawab ({unansweredCount})</span>
            </div>
          </div>
        </div>

        {/* Question Grid Numbers 1 - 20 */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-5 gap-3">
            {questions.map((q, idx) => {
              const ans = answers[q.id];
              const isCurrent = idx === currentIndex;
              const isDoubt = ans?.isDoubtful;
              const hasAnswer =
                Boolean(ans?.selectedOption) ||
                (ans?.selectedComplexOptions && ans.selectedComplexOptions.length > 0) ||
                (ans?.trueFalseAnswers && Object.keys(ans.trueFalseAnswers).length > 0);

              let buttonStyle = 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50';
              let badgeContent = null;

              if (isDoubt) {
                buttonStyle = 'bg-amber-400 text-slate-900 border-amber-500 font-bold';
                badgeContent = '?';
              } else if (hasAnswer) {
                buttonStyle = 'bg-emerald-600 text-white border-emerald-700 font-bold';
                badgeContent = '✓';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  className={`relative p-3 rounded-lg border-2 text-center transition-all cursor-pointer shadow-xs ${buttonStyle} ${
                    isCurrent ? 'ring-3 ring-blue-500 ring-offset-1 font-extrabold scale-105' : ''
                  }`}
                >
                  <div className="text-base sm:text-lg">{idx + 1}</div>
                  <div className="text-[10px] uppercase tracking-tighter opacity-80 mt-0.5">
                    {q.type === 'pg' ? 'PG' : q.type === 'pg_kompleks' ? 'PGK' : 'B-S'}
                  </div>
                  {badgeContent && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold bg-white text-slate-800 border border-slate-300 shadow-xs">
                      {badgeContent}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
