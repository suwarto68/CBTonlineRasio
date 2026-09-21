import React, { useState } from 'react';
import { ExamResult, AppSettings } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { submitExamResultToSheet } from '../services/googleSheetsService';
import { Award, CheckCircle2, Clock, Calendar, RefreshCw, LogOut, Check, X, ShieldCheck, Database, FileSpreadsheet } from 'lucide-react';

interface ResultScreenProps {
  result: ExamResult;
  settings: AppSettings;
  onLogout: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  settings,
  onLogout
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(result.syncedToSheets);

  const handleSyncToSheets = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await submitExamResultToSheet(settings.appScriptUrl, result);
      setIsSyncing(false);
      setSyncStatusMsg(res.message);
      if (res.success) {
        setIsSynced(true);
      }
    } catch (err: any) {
      setIsSyncing(false);
      setSyncStatusMsg(`Gagal: ${err.message || 'Error sync'}`);
    }
  };

  const isPassed = result.score >= 70; // KKM 70

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header Ribbon */}
        <div className="bg-[#0f4c81] text-white p-6 text-center relative">
          <div className="flex justify-center mb-3">
            <div className="p-2 bg-white rounded-full shadow-md">
              <SchoolLogo url={settings.logoUrl} size="lg" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
            HASIL UJIAN CBT ANBK 2026/2027
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 font-medium">
            {settings.schoolName} • {settings.subjectName}
          </p>
        </div>

        {/* Score Hero Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="text-center sm:text-left space-y-1">
              <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                SKOR AKHIR ASESMEN
              </div>
              <div className="text-4xl sm:text-5xl font-black text-blue-900 tracking-tight font-mono">
                {result.score} <span className="text-lg font-bold text-slate-400">/ 100</span>
              </div>
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                    isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{isPassed ? 'TUNTAS (Di atas KKM 70)' : 'PERLU PENGAYAAN MATERI RASIO'}</span>
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Jawaban Benar</div>
                <div className="text-xl font-bold text-emerald-600">
                  {result.correctCount} <span className="text-xs font-normal text-slate-400">Soal</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-xs">
                <div className="text-xs text-slate-500 font-medium">Total Soal</div>
                <div className="text-xl font-bold text-slate-800">
                  {result.totalQuestions} <span className="text-xs font-normal text-slate-400">Soal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student & Exam Details Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm shadow-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-700 border-b border-slate-200 flex items-center justify-between">
              <span>Rincian Rekapitulasi Data Siswa</span>
              <span className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Token: {result.token}
              </span>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Nama Peserta:</span>
                <span className="font-bold text-slate-900">{result.studentName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Kode / NISN:</span>
                <span className="font-mono font-bold text-slate-800">{result.studentCode}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Kelas / Rombel:</span>
                <span className="font-bold text-slate-800">Kelas {result.classRoom}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500 font-medium">Waktu Selesai:</span>
                <span className="font-medium text-slate-700">{result.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Durasi Pengerjaan:</span>
                <span className="font-medium text-slate-700">{result.durationMinutes} Menit</span>
              </div>
            </div>
          </div>

          {/* Google Spreadsheet Synchronization Status Card */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <FileSpreadsheet className="w-4 h-4 text-blue-700" />
                <span>Penyimpanan Google Spreadsheet (sheet JawabanUjian)</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  isSynced
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {isSynced ? 'Tersimpan ke Sheets ✓' : 'Tersimpan di Cache Lokal'}
              </span>
            </div>

            <p className="text-slate-600">
              Data yang dicatat meliputi: <strong>Kode Siswa, Nama, Kelas, Token, Waktu Submit, Skor Akhir, serta rincian jawaban tiap nomor (1 s.d. 20)</strong>.
            </p>

            {syncStatusMsg && (
              <div className="p-2.5 bg-white border border-blue-300 rounded font-medium text-blue-950">
                {syncStatusMsg}
              </div>
            )}

            {!isSynced && (
              <button
                type="button"
                onClick={handleSyncToSheets}
                disabled={isSyncing}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghubungkan ke Google Apps Script...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sinkronkan Sekarang ke Google Spreadsheet</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Terima kasih telah mengikuti CBT ANBK dengan integritas.
          </span>
          <button
            id="btn-logout-from-result"
            type="button"
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi Ujian</span>
          </button>
        </div>
      </div>
    </div>
  );
};
