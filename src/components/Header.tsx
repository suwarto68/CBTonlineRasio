import React from 'react';
import { SchoolLogo } from './SchoolLogo';
import { StudentUser, AppSettings } from '../types';
import { ConnectionStatus } from '../services/googleSheetsService';
import { Clock, LogOut, Wifi, WifiOff, Database, ShieldCheck, User } from 'lucide-react';

interface HeaderProps {
  settings: AppSettings;
  currentUser: StudentUser | null;
  connectionStatus: ConnectionStatus;
  timeRemainingSeconds?: number;
  fontSize: 'normal' | 'large' | 'extra-large';
  setFontSize?: (size: 'normal' | 'large' | 'extra-large') => void;
  onLogout: () => void;
  onOpenQuestionList?: () => void;
  answeredCount?: number;
  totalQuestions?: number;
  isInExam?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentUser,
  connectionStatus,
  timeRemainingSeconds,
  fontSize,
  setFontSize,
  onLogout,
  onOpenQuestionList,
  answeredCount = 0,
  totalQuestions = 20,
  isInExam = false
}) => {
  // Format seconds to HH:MM:SS
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isLowTime = timeRemainingSeconds !== undefined && timeRemainingSeconds < 600; // < 10 mins

  return (
    <header id="cbt-anbk-header" className="bg-[#0f4c81] text-white shadow-md select-none sticky top-0 z-40 border-b border-[#0c3c66]">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: School Logo & Title */}
        <div className="flex items-center gap-3">
          <SchoolLogo url={settings.logoUrl} size="md" />
          <div className="leading-tight">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>{settings.schoolName}</span>
              <span className="hidden md:inline-block text-xs bg-amber-400 text-blue-950 font-extrabold px-1.5 py-0.5 rounded tracking-normal">
                ANBK FASE D
              </span>
            </h1>
            <p className="text-xs text-blue-100 font-medium">
              ASESMEN KOMPETENSI MINIMUM (AKM) T.A. {settings.academicYear}
            </p>
          </div>
        </div>

        {/* Center/Right Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Connection Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
              connectionStatus.isConnected
                ? 'bg-emerald-600/30 text-emerald-200 border-emerald-400/40'
                : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
            }`}
            title={connectionStatus.message}
          >
            {connectionStatus.isConnected ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span className="hidden lg:inline">Spreadsheet:</span>
                <span>Terhubung</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-amber-300" />
                <span>Mode Offline</span>
              </>
            )}
          </div>

          {/* Exam Timer & Controls (Visible in Exam) */}
          {isInExam && timeRemainingSeconds !== undefined && (
            <div className="flex items-center gap-2">
              {/* Font Size Adjuster (ANBK requirement) */}
              {setFontSize && (
                <div className="hidden md:flex items-center bg-blue-900/70 rounded border border-blue-400/30 p-0.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 rounded transition-colors ${
                      fontSize === 'normal' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-200 hover:text-white'
                    }`}
                    title="Ukuran Teks Normal"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 rounded transition-colors ${
                      fontSize === 'large' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-200 hover:text-white'
                    }`}
                    title="Ukuran Teks Sedang"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('extra-large')}
                    className={`px-2 py-1 rounded transition-colors ${
                      fontSize === 'extra-large' ? 'bg-white text-blue-900 shadow-sm' : 'text-blue-200 hover:text-white'
                    }`}
                    title="Ukuran Teks Besar"
                  >
                    A+
                  </button>
                </div>
              )}

              {/* Countdown Timer */}
              <div
                id="exam-timer-display"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-sm sm:text-base font-bold shadow-inner ${
                  isLowTime
                    ? 'bg-rose-600 text-white animate-pulse border border-rose-400'
                    : 'bg-blue-950 text-amber-300 border border-blue-800'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-300" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>
            </div>
          )}

          {/* User Info & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-blue-400/30">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold leading-tight flex items-center justify-end gap-1 text-white">
                  <User className="w-3 h-3 text-amber-300 inline" />
                  <span>{currentUser.name}</span>
                </div>
                <div className="text-[11px] text-blue-200 font-medium">
                  Kelas {currentUser.classRoom} • {currentUser.code}
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="btn-logout-header"
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-2.5 py-1.5 rounded text-xs font-semibold transition-all shadow-sm cursor-pointer"
                title="Keluar dari sesi ujian"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Secondary Information Ribbon during Exam */}
      {isInExam && (
        <div className="bg-[#0b3860] border-t border-blue-900/60 px-4 py-1.5 text-xs text-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Mata Uji:</span>
            <span className="text-amber-300">{settings.subjectName}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Terjawab:</span>
              <span className="font-bold text-emerald-300">
                {answeredCount} / {totalQuestions} Soal
              </span>
            </div>

            {onOpenQuestionList && (
              <button
                id="btn-open-question-list-header"
                type="button"
                onClick={onOpenQuestionList}
                className="bg-amber-400 hover:bg-amber-500 text-blue-950 px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer shadow-sm"
              >
                Daftar Soal 📋
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
