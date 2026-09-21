import React, { useState } from 'react';
import { Question, UserAnswer, StudentUser, AppSettings } from '../types';
import { QuestionGraphic } from './QuestionGraphic';
import { QuestionNavModal } from './QuestionNavModal';
import { ExamFinishModal } from './ExamFinishModal';
import { ChevronLeft, ChevronRight, HelpCircle, Check, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface ExamScreenProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, UserAnswer>;
  fontSize: 'normal' | 'large' | 'extra-large';
  settings: AppSettings;
  currentUser: StudentUser;
  isSubmitting: boolean;
  onSelectQuestion: (index: number) => void;
  onUpdateAnswer: (questionId: number, answer: Partial<UserAnswer>) => void;
  onFinishExam: () => void;
  onOpenQuestionList: () => void;
  isQuestionListOpen: boolean;
  onCloseQuestionList: () => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  questions,
  currentIndex,
  answers,
  fontSize,
  settings,
  currentUser,
  isSubmitting,
  onSelectQuestion,
  onUpdateAnswer,
  onFinishExam,
  onOpenQuestionList,
  isQuestionListOpen,
  onCloseQuestionList
}) => {
  const [showFinishModal, setShowFinishModal] = useState(false);

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return null;

  const currentAnswer = answers[currentQuestion.id] || {
    questionId: currentQuestion.id,
    type: currentQuestion.type,
    isDoubtful: false
  };

  // Font size classes
  const fontClass = {
    'normal': 'text-sm sm:text-base leading-relaxed',
    'large': 'text-base sm:text-lg leading-relaxed',
    'extra-large': 'text-lg sm:text-xl leading-relaxed'
  }[fontSize];

  const titleFontClass = {
    'normal': 'text-base sm:text-lg font-bold',
    'large': 'text-lg sm:text-xl font-bold',
    'extra-large': 'text-xl sm:text-2xl font-bold'
  }[fontSize];

  // Handle PG Single Choice
  const handleSelectOption = (optionId: string) => {
    onUpdateAnswer(currentQuestion.id, {
      selectedOption: optionId,
      type: 'pg'
    });
  };

  // Handle PG Kompleks Multi Choice
  const handleToggleComplexOption = (optionId: string) => {
    const currentSelected = currentAnswer.selectedComplexOptions || [];
    const updated = currentSelected.includes(optionId)
      ? currentSelected.filter(id => id !== optionId)
      : [...currentSelected, optionId];

    onUpdateAnswer(currentQuestion.id, {
      selectedComplexOptions: updated,
      type: 'pg_kompleks'
    });
  };

  // Handle Benar - Salah Statement Selection
  const handleTrueFalseSelect = (statementId: string, value: boolean) => {
    const existing = currentAnswer.trueFalseAnswers || {};
    onUpdateAnswer(currentQuestion.id, {
      trueFalseAnswers: {
        ...existing,
        [statementId]: value
      },
      type: 'benar_salah'
    });
  };

  // Toggle Ragu-ragu
  const handleToggleDoubtful = () => {
    onUpdateAnswer(currentQuestion.id, {
      isDoubtful: !currentAnswer.isDoubtful
    });
  };

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Calculate overall answered questions for progress bar
  const answeredCount = Object.values(answers).filter(a => 
    Boolean(a.selectedOption) ||
    (a.selectedComplexOptions && a.selectedComplexOptions.length > 0) ||
    (a.trueFalseAnswers && Object.keys(a.trueFalseAnswers).length > 0)
  ).length;

  const progressPercentage = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-slate-100 min-h-[calc(100vh-110px)] select-text">
      {/* Top Breadcrumb & Progress Indicator */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-blue-900 bg-blue-100 px-2.5 py-1 rounded text-xs">
              SOAL NO. {currentIndex + 1} DARI {questions.length}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700 uppercase">
              {currentQuestion.type === 'pg' && 'Pilihan Ganda (1 Jawaban)'}
              {currentQuestion.type === 'pg_kompleks' && 'Pilihan Ganda Kompleks (Bisa Lebih Dari 1)'}
              {currentQuestion.type === 'benar_salah' && 'Pernyataan Benar - Salah'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">
              Indikator {currentQuestion.indicator}: {currentQuestion.indicatorTitle}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-600">
              Kemajuan: <strong className="text-blue-700">{answeredCount}/{questions.length}</strong> ({progressPercentage}%)
            </span>
            <div className="w-28 sm:w-36 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <button
              id="btn-open-soal-list-subnav"
              type="button"
              onClick={onOpenQuestionList}
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold px-3 py-1 rounded shadow-xs text-xs cursor-pointer"
            >
              Daftar Soal 📋
            </button>
          </div>
        </div>
      </div>

      {/* Main CBT ANBK Split Screen: Left Stimulus, Right Response Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* ==================================================== */}
        {/* LEFT COLUMN: Stimulus, Gambar/Grafik/Tabel, Pertanyaan */}
        {/* ==================================================== */}
        <section
          id="exam-stimulus-panel"
          className="flex-1 bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-7 flex flex-col overflow-y-auto max-h-[calc(100vh-230px)] lg:max-h-[calc(100vh-210px)]"
        >
          {/* Stimulus Title & Badge */}
          <div className="border-b border-slate-200 pb-3 mb-4 flex items-start justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800 mb-0.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Stimulus TKA Puspendik Kemdikbud</span>
              </div>
              <h2 className={`${titleFontClass} text-slate-900`}>
                {currentQuestion.stimulusTitle}
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 shrink-0">
              Level {currentQuestion.cognitiveLevel}
            </span>
          </div>

          {/* Stimulus Narrative Text (~100 kata sesuai ketentuan) */}
          <div className={`text-slate-800 font-normal leading-relaxed text-justify mb-3 ${fontClass}`}>
            <p className="whitespace-pre-line">{currentQuestion.stimulusText}</p>
          </div>

          {/* Graphic / Table / Chart / Map Infographic Component */}
          {currentQuestion.stimulusGraphicType && (
            <QuestionGraphic
              graphicType={currentQuestion.stimulusGraphicType}
              data={currentQuestion.stimulusData}
              indicator={currentQuestion.indicator}
            />
          )}

          {/* Kalimat Tanya / Prompt Utama Soal */}
          <div className="mt-4 pt-4 border-t-2 border-slate-200 bg-blue-50/50 p-4 rounded-lg border">
            <h3 className={`font-bold text-slate-900 ${fontClass}`}>
              {currentQuestion.questionText}
            </h3>
            {currentQuestion.type === 'pg_kompleks' && (
              <p className="text-xs text-blue-700 font-semibold mt-1">
                * Catatan: Anda dapat mencentang lebih dari satu pilihan jawaban yang menurut Anda benar.
              </p>
            )}
            {currentQuestion.type === 'benar_salah' && (
              <p className="text-xs text-blue-700 font-semibold mt-1">
                * Catatan: Berikan pilihan Benar atau Salah pada setiap baris pernyataan di sebelah kanan.
              </p>
            )}
          </div>
        </section>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: Pilihan Jawaban */}
        {/* ==================================================== */}
        <section
          id="exam-options-panel"
          className="lg:w-[480px] bg-white rounded-xl shadow-md border border-slate-200 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-230px)] lg:max-h-[calc(100vh-210px)]"
        >
          <div>
            <div className="border-b border-slate-200 pb-3 mb-4 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">
                Lembar Jawaban Peserta:
              </h4>
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                No. {currentIndex + 1}
              </span>
            </div>

            {/* TIPE 1: PILIHAN GANDA BIASA (1 JAWABAN BENAR) */}
            {currentQuestion.type === 'pg' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswer.selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-3.5 rounded-lg border-2 transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Radio Circle with Letter A, B, C, D */}
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className={`text-slate-800 pt-0.5 ${fontClass} ${isSelected ? 'font-semibold text-blue-950' : ''}`}>
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TIPE 2: PILIHAN GANDA KOMPLEKS (LEBIH DARI SATU JAWABAN BENAR) */}
            {currentQuestion.type === 'pg_kompleks' && currentQuestion.complexOptions && (
              <div className="space-y-3">
                {currentQuestion.complexOptions.map((opt, idx) => {
                  const selectedIds = currentAnswer.selectedComplexOptions || [];
                  const isChecked = selectedIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleComplexOption(opt.id)}
                      className={`w-full text-left p-3.5 rounded-lg border-2 transition-all flex items-start gap-3 cursor-pointer ${
                        isChecked
                          ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Checkbox Square */}
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-blue-700 text-white shadow-xs'
                            : 'bg-white border-2 border-slate-400'
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </span>
                      <div className="flex-1">
                        <span className={`text-slate-800 ${fontClass} ${isChecked ? 'font-semibold text-blue-950' : ''}`}>
                          {opt.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TIPE 3: BENAR - SALAH (3 PERNYATAAN DENGAN RADIO PILIHAN) */}
            {currentQuestion.type === 'benar_salah' && currentQuestion.trueFalseStatements && (
              <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-[#e8f1f9] text-[#0f4c81] font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-3 border-r border-slate-300">Pernyataan Analisis</th>
                      <th className="p-3 w-16 text-center border-r border-slate-300">Benar</th>
                      <th className="p-3 w-16 text-center">Salah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentQuestion.trueFalseStatements.map((stmt, sIdx) => {
                      const userChoices = currentAnswer.trueFalseAnswers || {};
                      const value = userChoices[stmt.id];
                      return (
                        <tr
                          key={stmt.id}
                          className={sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                        >
                          <td className="p-3 border-t border-r border-slate-200 text-slate-800 font-medium">
                            {stmt.statement}
                          </td>
                          <td className="p-2 border-t border-r border-slate-200 text-center">
                            <label className="inline-flex items-center justify-center p-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`tf_${stmt.id}`}
                                checked={value === true}
                                onChange={() => handleTrueFalseSelect(stmt.id, true)}
                                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              />
                            </label>
                          </td>
                          <td className="p-2 border-t border-slate-200 text-center">
                            <label className="inline-flex items-center justify-center p-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`tf_${stmt.id}`}
                                checked={value === false}
                                onChange={() => handleTrueFalseSelect(stmt.id, false)}
                                className="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer"
                              />
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Ragu-ragu Status Badge inside Response Column */}
          {currentAnswer.isDoubtful && (
            <div className="mt-4 p-2.5 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Status: Soal ini ditandai ragu-ragu oleh peserta.</span>
            </div>
          )}
        </section>
      </main>

      {/* ==================================================== */}
      {/* AUTHENTIC CBT ANBK BOTTOM NAVIGATION CONTROLS */}
      {/* Warna tombol: Merah (Sebelumnya), Kuning (Ragu-ragu), Biru (Berikutnya / Selesai) */}
      {/* ==================================================== */}
      <footer id="cbt-exam-footer-nav" className="bg-white border-t border-slate-300 py-3 px-4 sm:px-8 shadow-lg sticky bottom-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* 1. TOMBOL MERAH: SOAL SEBELUMNYA */}
          <button
            id="btn-soal-sebelumnya"
            type="button"
            disabled={isFirstQuestion}
            onClick={() => onSelectQuestion(currentIndex - 1)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer bg-[#d32f2f] hover:bg-[#b71c1c] active:bg-[#9a1616] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 stroke-[3]" />
            <span>SOAL SEBELUMNYA</span>
          </button>

          {/* 2. TOMBOL KUNING: RAGU-RAGU (DENGAN CHECKBOX ANBK) */}
          <button
            id="btn-ragu-ragu"
            type="button"
            onClick={handleToggleDoubtful}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer border ${
              currentAnswer.isDoubtful
                ? 'bg-amber-400 text-slate-950 border-amber-600 ring-2 ring-amber-500'
                : 'bg-[#fbc02d] hover:bg-[#f9a825] active:bg-[#f57f17] text-slate-900 border-amber-400'
            }`}
          >
            <input
              type="checkbox"
              checked={currentAnswer.isDoubtful}
              onChange={() => {}} // Controlled by button click
              className="w-4 h-4 text-amber-700 rounded border-slate-400 focus:ring-amber-500 pointer-events-none"
            />
            <span>RAGU - RAGU</span>
          </button>

          {/* 3. TOMBOL BIRU: SOAL BERIKUTNYA ATAU SELESAI */}
          {isLastQuestion ? (
            <button
              id="btn-selesai-ujian"
              type="button"
              onClick={() => setShowFinishModal(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-7 py-2.5 rounded-lg font-extrabold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900"
            >
              <span>SELESAI UJIAN</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              id="btn-soal-berikutnya"
              type="button"
              onClick={() => onSelectQuestion(currentIndex + 1)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white shadow-md transition-all cursor-pointer bg-[#1976d2] hover:bg-[#1565c0] active:bg-[#0d47a1]"
            >
              <span>SOAL BERIKUTNYA</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </footer>

      {/* Modal Daftar Soal (1 s.d. 20) */}
      <QuestionNavModal
        questions={questions}
        currentIndex={currentIndex}
        answers={answers}
        isOpen={isQuestionListOpen}
        onClose={onCloseQuestionList}
        onSelectQuestion={onSelectQuestion}
      />

      {/* Modal Konfirmasi Selesai Ujian */}
      <ExamFinishModal
        questions={questions}
        answers={answers}
        isOpen={showFinishModal}
        isSubmitting={isSubmitting}
        onConfirmFinish={() => {
          setShowFinishModal(false);
          onFinishExam();
        }}
        onCancel={() => setShowFinishModal(false)}
      />
    </div>
  );
};
