import React, { useState } from 'react';
import { Question, UserAnswer } from '../types';
import { AlertTriangle, CheckCircle2, Send, ArrowLeft, Loader2 } from 'lucide-react';

interface ExamFinishModalProps {
  questions: Question[];
  answers: Record<number, UserAnswer>;
  isOpen: boolean;
  isSubmitting: boolean;
  onConfirmFinish: () => void;
  onCancel: () => void;
}

export const ExamFinishModal: React.FC<ExamFinishModalProps> = ({
  questions,
  answers,
  isOpen,
  isSubmitting,
  onConfirmFinish,
  onCancel
}) => {
  const [agreementChecked, setAgreementChecked] = useState(false);

  if (!isOpen) return null;

  // Calculate status counts
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

  const hasIncomplete = unansweredCount > 0 || doubtfulCount > 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#0f4c81] text-white px-5 py-4 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base sm:text-lg">Konfirmasi Selesai Ujian</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700">
            Apakah Anda yakin ingin menyelesaikan sesi ujian ini? Setelah menyelesaikan ujian, Anda tidak dapat kembali mengubah jawaban.
          </p>

          {/* Status Breakdown Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between font-semibold text-slate-700">
              <span>Total Butir Soal:</span>
              <span className="font-bold">{questions.length} Soal</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Sudah Dijawab:</span>
              <span>{answeredCount} Soal</span>
            </div>
            {doubtfulCount > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Masih Ragu-ragu:</span>
                <span>{doubtfulCount} Soal</span>
              </div>
            )}
            {unansweredCount > 0 && (
              <div className="flex justify-between text-rose-700 font-semibold">
                <span>Belum Dijawab:</span>
                <span>{unansweredCount} Soal</span>
              </div>
            )}
          </div>

          {/* Warning Banner if there are empty or doubtful answers */}
          {hasIncomplete && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-xs text-amber-900 space-y-1">
              <div className="font-bold">Perhatian:</div>
              <p>
                Masih ada <strong>{unansweredCount} soal belum dijawab</strong> dan{' '}
                <strong>{doubtfulCount} soal dengan tanda ragu-ragu</strong>. Disarankan memeriksa kembali sebelum menyelesaikan.
              </p>
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-800 font-medium cursor-pointer bg-blue-50/70 p-3 rounded-lg border border-blue-200">
              <input
                id="checkbox-finish-agreement"
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>
                Saya telah memeriksa seluruh lembar jawaban dan menyatakan selesai mengerjakan ujian dengan jujur.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Periksa Kembali</span>
          </button>

          <button
            id="btn-confirm-submit-exam"
            type="button"
            onClick={onConfirmFinish}
            disabled={!agreementChecked || isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Spreadsheet...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>SELESAI & KIRIM JAWABAN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
