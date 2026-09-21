import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { StudentUser, AppSettings } from '../types';
import { ConnectionStatus } from '../services/googleSheetsService';
import { LogIn, KeyRound, User, Lock, Database, ShieldAlert, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface LoginScreenProps {
  settings: AppSettings;
  students: StudentUser[];
  connectionStatus: ConnectionStatus;
  onLoginSuccess: (user: StudentUser, enteredToken: string) => void;
  onGoToAdmin: () => void;
  onRefreshConnection: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  settings,
  students,
  connectionStatus,
  onLoginSuccess,
  onGoToAdmin,
  onRefreshConnection,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [classRoom, setClassRoom] = useState<'7A' | '7B'>('7A');
  const [token, setToken] = useState(settings.activeToken || 'ANBK2026');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Silakan masukkan Username / NISN Anda.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Silakan masukkan Password Anda.');
      return;
    }

    if (!token.trim()) {
      setErrorMessage('Token Ujian wajib diisi. Mintalah token aktif kepada Pengawas/Proktor.');
      return;
    }

    // Verify token
    if (token.trim().toUpperCase() !== settings.activeToken.toUpperCase()) {
      setErrorMessage(`Token Ujian salah atau telah kedaluwarsa. Token aktif: ${settings.activeToken}`);
      return;
    }

    setIsSubmitting(true);

    // Find student match
    const cleanUser = username.trim().toLowerCase();
    const matched = students.find(s => 
      (s.username.toLowerCase() === cleanUser || s.code.toLowerCase() === cleanUser) &&
      s.classRoom === classRoom
    );

    if (!matched) {
      setIsSubmitting(false);
      setErrorMessage(`Siswa dengan username "${username}" tidak ditemukan di Kelas ${classRoom}. Periksa kembali data atau pilih kelas yang sesuai.`);
      return;
    }

    // Check password if set
    if (matched.password && matched.password !== password.trim()) {
      setIsSubmitting(false);
      setErrorMessage('Password yang Anda masukkan salah. Default password simulasi: 123');
      return;
    }

    // Success!
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(matched, token.trim().toUpperCase());
    }, 400);
  };

  // Quick fill helper for testing
  const handleQuickFill = (user: StudentUser) => {
    setUsername(user.username);
    setPassword(user.password || '123');
    setClassRoom(user.classRoom);
    setToken(settings.activeToken);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* CBT ANBK White Login Box with Shadow */}
        <div
          id="cbt-login-card"
          className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6 text-white text-center relative">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-white rounded-full shadow-md">
                <SchoolLogo url={settings.logoUrl} size="lg" />
              </div>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-white">
              CBT ASESMEN NASIONAL
            </h2>
            <p className="text-xs text-blue-100 mt-0.5 font-medium">
              SMP Negeri 1 Wanaraya • T.A. {settings.academicYear}
            </p>
            <div className="mt-2 inline-block bg-amber-400 text-blue-950 font-bold text-xs px-3 py-0.5 rounded-full shadow-sm">
              Materi Rasio Fase D (Kelas 7)
            </div>
          </div>

          {/* Database Connection Status Ribbon */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus.isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-600">Database:</span>
              <span className={connectionStatus.isConnected ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                {connectionStatus.isConnected ? 'Google Sheets Terhubung' : 'Mode Offline / Lokal'}
              </span>
            </div>
            <button
              type="button"
              onClick={onRefreshConnection}
              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-slate-200 transition-colors"
              title="Periksa ulang koneksi database"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div
                id="login-error-alert"
                className="bg-rose-50 border-l-4 border-rose-500 p-3 text-xs text-rose-800 flex items-start gap-2 rounded-r animate-fadeIn"
              >
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Input: Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username / NISN Siswa <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="input-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: ahmad7a atau 7A-001"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Input: Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password (default: 123)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Dropdown: Kelas [7A dan 7B] as requested */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Pilih Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="select-kelas"
                  value={classRoom}
                  onChange={(e) => setClassRoom(e.target.value as '7A' | '7B')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="7A">Kelas 7A (Fase D)</option>
                  <option value="7B">Kelas 7B (Fase D)</option>
                </select>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Data login disinkronkan dari Google Spreadsheet (sheet <code>UserLogin</code>).
              </p>
            </div>

            {/* Input: Token Ujian */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Token Ujian <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  Token Aktif: {settings.activeToken}
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="input-token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  placeholder="Masukkan 8 digit token"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono tracking-widest uppercase font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Tombol Masuk / Login Siswa */}
            <div className="pt-2">
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1565c0] hover:bg-[#0d47a1] active:bg-blue-900 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Data...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>MASUK KE HALAMAN UJIAN</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Test Student Accounts for Fast Verification */}
          <div className="bg-blue-50/70 p-4 border-t border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Akun Uji Coba Cepat (1-Klik):
              </span>
              <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-medium">
                Password: 123
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {students.slice(0, 4).map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => handleQuickFill(s)}
                  className="text-left text-xs bg-white hover:bg-blue-100 border border-blue-200 rounded p-1.5 transition-colors cursor-pointer group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-blue-900 truncate">
                    {s.name}
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>{s.classRoom}</span>
                    <span className="font-mono text-blue-600 font-semibold">{s.username}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Admin Link */}
          <div className="bg-slate-100 p-3 text-center border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Portal ANBK Mandiri 2026/2027</span>
            <button
              id="btn-goto-admin"
              type="button"
              onClick={onGoToAdmin}
              className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              ⚙️ Portal Admin & Guru
            </button>
          </div>
        </div>

        {/* School Info Footer */}
        <p className="text-center text-xs text-slate-500 mt-4">
          SMP Negeri 1 Wanaraya • Barito Kuala • Kalimantan Selatan
        </p>
      </div>
    </div>
  );
};
