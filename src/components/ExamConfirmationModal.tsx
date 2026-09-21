import React from 'react';
import { StudentUser, AppSettings } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { Play, UserCheck, Clock, BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';

interface ExamConfirmationModalProps {
  user: StudentUser;
  token: string;
  settings: AppSettings;
  onStartExam: () => void;
  onCancel: () => void;
}

export const ExamConfirmationModal: React.FC<ExamConfirmationModalProps> = ({
  user,
  token,
  settings,
  onStartExam,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header Konfirmasi */}
        <div className="bg-[#0f4c81] text-white p-5 flex items-center justify-between border-b border-blue-950">
          <div className="flex items-center gap-3">
            <SchoolLogo url={settings.logoUrl} size="md" />
            <div>
              <h3 className="font-bold text-base sm:text-lg uppercase tracking-tight">
                Konfirmasi Data Peserta Ujian
              </h3>
              <p className="text-xs text-blue-200 font-medium">
                {settings.schoolName} • Tahun Ajaran {settings.academicYear}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between border-b border-blue-100 pb-2">
              <span className="text-slate-500 font-medium">Kode / NISN:</span>
              <span className="font-mono font-bold text-slate-800">{user.code}</span>
            </div>
            <div className="flex justify-between border-b border-blue-100 pb-2">
              <span className="text-slate-500 font-medium">Nama Peserta:</span>
              <span className="font-bold text-blue-900">{user.name}</span>
            </div>
            <div className="flex justify-between border-b border-blue-100 pb-2">
              <span className="text-slate-500 font-medium">Kelas / Rombel:</span>
              <span className="font-bold text-slate-800">Kelas {user.classRoom} (Fase D)</span>
            </div>
            <div className="flex justify-between border-b border-blue-100 pb-2">
              <span className="text-slate-500 font-medium">Mata Pelajaran:</span>
              <span className="font-bold text-emerald-800">{settings.subjectName}</span>
            </div>
            <div className="flex justify-between border-b border-blue-100 pb-2">
              <span className="text-slate-500 font-medium">Alokasi Waktu:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                {settings.examDurationMinutes} Menit
              </span>
            </div>
            <div className="flex justify-between items-center pt-0.5">
              <span className="text-slate-500 font-medium">Token Terverifikasi:</span>
              <span className="font-mono font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                {token}
              </span>
            </div>
          </div>

          {/* Ketentuan Pengerjaan */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-xs text-amber-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Petunjuk & Tata Tertib Pengerjaan CBT:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>Ujian terdiri dari <strong>20 Butir Soal</strong> matematika materi rasio dan perbandingan.</li>
              <li>Terdapat 3 tipe soal: <strong>Pilihan Ganda</strong>, <strong>Pilihan Ganda Kompleks</strong>, dan <strong>Benar - Salah</strong>.</li>
              <li>Urutan soal diacak secara otomatis untuk setiap peserta.</li>
              <li>Gunakan tombol <span className="text-yellow-700 font-bold">RAGU-RAGU (Kuning)</span> bila Anda belum yakin dengan jawaban Anda.</li>
              <li>Waktu ujian akan otomatis berjalan mundur saat Anda menekan tombol <strong>Mulai Ujian</strong>.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Login</span>
          </button>

          <button
            id="btn-confirm-start-exam"
            type="button"
            onClick={onStartExam}
            className="px-6 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>MULAI UJIAN SEKARANG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
