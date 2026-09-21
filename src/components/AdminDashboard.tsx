import React, { useState } from 'react';
import { StudentUser, ExamResult, AppSettings, Question } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { ConnectionStatus, testGoogleScriptConnection, fetchStudentsFromSheet, submitExamResultToSheet } from '../services/googleSheetsService';
import { EXAM_QUESTIONS } from '../data/questions';
import { APPSCRIPT_CODE } from '../data/appscriptCode';
import {
  Users,
  Award,
  Settings,
  BookOpen,
  Code,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileSpreadsheet,
  Search,
  Wifi,
  Database
} from 'lucide-react';

interface AdminDashboardProps {
  settings: AppSettings;
  students: StudentUser[];
  results: ExamResult[];
  connectionStatus: ConnectionStatus;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onUpdateStudents: (newStudents: StudentUser[]) => void;
  onClearResults: () => void;
  onBackToApp: () => void;
  onRefreshConnection: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  students,
  results,
  connectionStatus,
  onUpdateSettings,
  onUpdateStudents,
  onClearResults,
  onBackToApp,
  onRefreshConnection
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'results' | 'settings' | 'solutions' | 'appscript'>('users');

  // Settings State
  const [formSettings, setFormSettings] = useState<AppSettings>({ ...settings });
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  // User Management State
  const [selectedClassFilter, setSelectedClassFilter] = useState<'ALL' | '7A' | '7B'>('ALL');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [isPullingFromSheet, setIsPullingFromSheet] = useState(false);
  const [pullStatusMsg, setPullStatusMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<StudentUser>>({
    code: '',
    name: '',
    username: '',
    password: '123',
    classRoom: '7A'
  });

  // Solutions Password Protection State (Password: ANBK2026)
  const [isSolutionsUnlocked, setIsSolutionsUnlocked] = useState(false);
  const [solutionPasswordInput, setSolutionPasswordInput] = useState('');
  const [solutionError, setSolutionError] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);

  // Results Detail Modal
  const [selectedResultForDetail, setSelectedResultForDetail] = useState<ExamResult | null>(null);

  // Copy code helper
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    alert('Pengaturan Ujian berhasil disimpan!');
  };

  // Test connection button
  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setTestResultMsg(null);
    const status = await testGoogleScriptConnection(formSettings.appScriptUrl);
    setIsTestingConn(false);
    setTestResultMsg(status.message);
    onRefreshConnection();
  };

  // Tarik dari Spreadsheet Handler (sheet UserLogin)
  const handlePullFromSpreadsheet = async () => {
    setIsPullingFromSheet(true);
    setPullStatusMsg(null);
    try {
      const res = await fetchStudentsFromSheet(settings.appScriptUrl);
      setIsPullingFromSheet(false);
      if (res.success && res.data) {
        onUpdateStudents(res.data);
        setPullStatusMsg({ success: true, text: res.message });
      } else {
        setPullStatusMsg({ success: false, text: res.message });
      }
    } catch (err: any) {
      setIsPullingFromSheet(false);
      setPullStatusMsg({ success: false, text: err.message || 'Gagal menarik data' });
    }
  };

  // Add Student Handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.code || !newUser.name || !newUser.username) {
      alert('Mohon isi semua field data siswa.');
      return;
    }

    const created: StudentUser = {
      code: newUser.code.trim(),
      name: newUser.name.trim(),
      username: newUser.username.trim(),
      password: newUser.password || '123',
      classRoom: (newUser.classRoom as '7A' | '7B') || '7A'
    };

    onUpdateStudents([created, ...students]);
    setShowAddUserModal(false);
    setNewUser({ code: '', name: '', username: '', password: '123', classRoom: '7A' });
  };

  // Delete Student
  const handleDeleteStudent = (code: string) => {
    if (confirm(`Yakin ingin menghapus data siswa dengan kode ${code}?`)) {
      onUpdateStudents(students.filter(s => s.code !== code));
    }
  };

  // Solutions Unlock
  const handleUnlockSolutions = (e: React.FormEvent) => {
    e.preventDefault();
    if (solutionPasswordInput === 'ANBK2026') {
      setIsSolutionsUnlocked(true);
      setSolutionError('');
    } else {
      setSolutionError('Password salah! Akses ke naskah pembahasan ditolak.');
    }
  };

  // Export Results to CSV
  const handleExportCSV = () => {
    if (results.length === 0) {
      alert('Belum ada data hasil ujian untuk diexport.');
      return;
    }

    const headers = ['Waktu', 'Kode_Siswa', 'Nama_Peserta', 'Kelas', 'Token', 'Skor_Akhir', 'Jumlah_Benar', 'Total_Soal', 'Durasi_Menit'];
    for (let i = 1; i <= 20; i++) {
      headers.push(`No_${i}`);
    }

    const rows = results.map(r => {
      const row = [
        `"${r.endTime}"`,
        `"${r.studentCode}"`,
        `"${r.studentName}"`,
        `"${r.classRoom}"`,
        `"${r.token}"`,
        r.score,
        r.correctCount,
        r.totalQuestions,
        r.durationMinutes
      ];
      for (let i = 1; i <= 20; i++) {
        const ans = r.answersSummary?.[i];
        row.push(`"${ans !== undefined ? JSON.stringify(ans).replace(/"/g, '""') : '-'}"`);
      }
      return row.join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hasil_Ujian_ANBK_SMPN1Wanaraya_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPSCRIPT_CODE);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2500);
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesClass = selectedClassFilter === 'ALL' || s.classRoom === selectedClassFilter;
    const matchesQuery = !searchUserQuery ||
      s.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchUserQuery.toLowerCase());
    return matchesClass && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-[#0b3860] text-white shadow-md border-b border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SchoolLogo url={settings.logoUrl} size="sm" />
            <div>
              <h1 className="text-base sm:text-lg font-bold">
                PANEL PROKTOR & ADMIN ANBK
              </h1>
              <p className="text-xs text-blue-200">
                {settings.schoolName} • Tahun Ajaran {settings.academicYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                connectionStatus.isConnected
                  ? 'bg-emerald-600/30 text-emerald-200 border-emerald-400/40'
                  : 'bg-amber-500/20 text-amber-200 border-amber-400/30'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>{connectionStatus.isConnected ? 'Google Sheets Terhubung' : 'Mode Offline'}</span>
            </div>

            <button
              id="btn-admin-back-to-app"
              type="button"
              onClick={onBackToApp}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Ujian</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 border-t border-blue-900/50 pt-1">
          <button
            id="tab-btn-users"
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-amber-400 text-white bg-blue-900/40'
                : 'border-transparent text-blue-200 hover:text-white hover:bg-blue-900/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Pengguna ({students.length})</span>
          </button>

          <button
            id="tab-btn-results"
            type="button"
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'results'
                ? 'border-amber-400 text-white bg-blue-900/40'
                : 'border-transparent text-blue-200 hover:text-white hover:bg-blue-900/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Hasil Ujian ({results.length})</span>
          </button>

          <button
            id="tab-btn-settings"
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-400 text-white bg-blue-900/40'
                : 'border-transparent text-blue-200 hover:text-white hover:bg-blue-900/20'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Ujian</span>
          </button>

          <button
            id="tab-btn-solutions"
            type="button"
            onClick={() => setActiveTab('solutions')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'solutions'
                ? 'border-amber-400 text-white bg-blue-900/40'
                : 'border-transparent text-blue-200 hover:text-white hover:bg-blue-900/20'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>Akses Pembahasan {isSolutionsUnlocked ? '🔓' : '🔒'}</span>
          </button>

          <button
            id="tab-btn-appscript"
            type="button"
            onClick={() => setActiveTab('appscript')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appscript'
                ? 'border-amber-400 text-white bg-blue-900/40'
                : 'border-transparent text-blue-200 hover:text-white hover:bg-blue-900/20'
            }`}
          >
            <Code className="w-4 h-4 text-emerald-300" />
            <span>Kode Google Apps Script</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* ==================================================== */}
        {/* TAB 1: DATA PENGGUNA (SISWA 7A & 7B) */}
        {/* ==================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Top Toolbar */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchUserQuery}
                    onChange={(e) => setSearchUserQuery(e.target.value)}
                    placeholder="Cari nama / NISN / username..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Filter Kelas */}
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value as any)}
                  className="px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold bg-slate-50 cursor-pointer"
                >
                  <option value="ALL">Semua Kelas ({students.length})</option>
                  <option value="7A">Kelas 7A ({students.filter(s => s.classRoom === '7A').length})</option>
                  <option value="7B">Kelas 7B ({students.filter(s => s.classRoom === '7B').length})</option>
                </select>
              </div>

              {/* Action Buttons: "Tarik dari spreadsheet" + "Tambah Siswa" */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  id="btn-pull-from-spreadsheet"
                  type="button"
                  onClick={handlePullFromSpreadsheet}
                  disabled={isPullingFromSheet}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  title="Ambil data siswa dari Google Spreadsheet sheet UserLogin"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPullingFromSheet ? 'animate-spin' : ''}`} />
                  <span>Tarik dari Spreadsheet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Siswa</span>
                </button>
              </div>
            </div>

            {/* Status message for pull */}
            {pullStatusMsg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  pullStatusMsg.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border border-amber-300'
                }`}
              >
                {pullStatusMsg.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pullStatusMsg.text}</span>
              </div>
            )}

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#e8f1f9] text-[#0f4c81] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Kode / NISN</th>
                      <th className="p-3">Nama Lengkap Peserta</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Password</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-500">
                          Tidak ada data siswa ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((s, idx) => (
                        <tr key={s.code} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          <td className="p-3 text-center text-slate-500 font-mono">{idx + 1}</td>
                          <td className="p-3 font-mono font-bold text-slate-800">{s.code}</td>
                          <td className="p-3 font-bold text-blue-950">{s.name}</td>
                          <td className="p-3 font-mono text-slate-700 bg-slate-100/60 px-2 py-0.5 rounded inline-block my-2">
                            {s.username}
                          </td>
                          <td className="p-3 font-mono text-slate-500">{s.password || '123'}</td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]">
                              Kelas {s.classRoom}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(s.code)}
                              className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: HASIL UJIAN */}
        {/* ==================================================== */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Daftar Rekap Nilai Ujian Siswa (Total: {results.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Data otomatis tercatat di Google Spreadsheet (sheet <code>JawabanUjian</code>).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  disabled={results.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Excel/CSV</span>
                </button>

                <button
                  type="button"
                  onClick={onClearResults}
                  disabled={results.length === 0}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan Hasil</span>
                </button>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#e8f1f9] text-[#0f4c81] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Waktu Selesai</th>
                      <th className="p-3">Kode Siswa</th>
                      <th className="p-3">Nama Siswa</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3">Token</th>
                      <th className="p-3 text-center">Benar</th>
                      <th className="p-3 text-center">Skor Akhir</th>
                      <th className="p-3 text-center">Spreadsheet</th>
                      <th className="p-3 text-center">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-500">
                          Belum ada siswa yang menyelesaikan ujian.
                        </td>
                      </tr>
                    ) : (
                      results.map((r, idx) => (
                        <tr key={r.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          <td className="p-3 text-center text-slate-500">{idx + 1}</td>
                          <td className="p-3 text-slate-600 font-mono text-[11px]">{r.endTime}</td>
                          <td className="p-3 font-mono font-bold text-slate-800">{r.studentCode}</td>
                          <td className="p-3 font-bold text-blue-950">{r.studentName}</td>
                          <td className="p-3 font-semibold text-slate-700">Kelas {r.classRoom}</td>
                          <td className="p-3 font-mono text-[11px]">{r.token}</td>
                          <td className="p-3 text-center font-bold text-emerald-600">
                            {r.correctCount} / {r.totalQuestions}
                          </td>
                          <td className="p-3 text-center font-mono font-black text-sm text-blue-900">
                            {r.score}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                r.syncedToSheets
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {r.syncedToSheets ? 'Tersimpan ✓' : 'Lokal'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedResultForDetail(r)}
                              className="text-blue-700 hover:text-blue-900 font-bold hover:underline cursor-pointer"
                            >
                              Lihat Jawaban
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: PENGATURAN UJIAN */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Konfigurasi Aplikasi CBT ANBK & Integrasi Spreadsheet
                </h3>
                <p className="text-xs text-slate-500">
                  Sesuaikan nama sekolah, durasi waktu, token aktif, dan endpoint Google Apps Script.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={formSettings.schoolName}
                    onChange={(e) => setFormSettings({ ...formSettings, schoolName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={formSettings.academicYear}
                    onChange={(e) => setFormSettings({ ...formSettings, academicYear: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mata Pelajaran & Fase
                  </label>
                  <input
                    type="text"
                    value={formSettings.subjectName}
                    onChange={(e) => setFormSettings({ ...formSettings, subjectName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Durasi Pengerjaan (Menit)
                  </label>
                  <input
                    type="number"
                    value={formSettings.examDurationMinutes}
                    onChange={(e) => setFormSettings({ ...formSettings, examDurationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="10"
                    max="180"
                    required
                  />
                </div>
              </div>

              {/* Token Ujian */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Token Ujian Aktif Siswa
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formSettings.activeToken}
                    onChange={(e) => setFormSettings({ ...formSettings, activeToken: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormSettings({ ...formSettings, activeToken: `ANBK${Math.floor(1000 + Math.random() * 9000)}` })}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    Acak Token
                  </button>
                </div>
              </div>

              {/* URL Logo Sekolah */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  URL Logo Sekolah (Sesuai Permintaan: https://ibb.co.com/S4095CCm)
                </label>
                <input
                  type="text"
                  value={formSettings.logoUrl}
                  onChange={(e) => setFormSettings({ ...formSettings, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* URL Google Apps Script Web App */}
              <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-blue-900 uppercase">
                    URL Google Apps Script Web App (Database Spreadsheet)
                  </label>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${connectionStatus.isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {connectionStatus.isConnected ? 'Status: Terhubung' : 'Status: Belum Terhubung'}
                  </span>
                </div>
                <input
                  type="text"
                  value={formSettings.appScriptUrl}
                  onChange={(e) => setFormSettings({ ...formSettings, appScriptUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-600">
                  Dapatkan URL ini setelah mempublikasikan skrip di Google Spreadsheet (menu Deploy &gt; New deployment &gt; Web app &gt; Anyone).
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingConn}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTestingConn ? 'animate-spin' : ''}`} />
                    <span>Uji Koneksi Sekarang</span>
                  </button>

                  {testResultMsg && (
                    <span className="text-xs text-slate-700 font-medium">
                      {testResultMsg}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Form */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0f4c81] hover:bg-blue-900 text-white font-bold rounded-lg text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: AKSES PEMBAHASAN (TERKUNCI PASSWORD: ANBK2026) */}
        {/* ==================================================== */}
        {activeTab === 'solutions' && (
          <div className="space-y-4">
            {!isSolutionsUnlocked ? (
              /* Password Gatekeeper (Password: ANBK2026, jangan ditampilkan secara terbuka di UI) */
              <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center space-y-4 my-8">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">
                    Akses Pembahasan Terlindungi
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Silakan masukkan Password Pengawas/Guru untuk membuka lembar kunci jawaban dan pembahasan naskah soal asesmen.
                  </p>
                </div>

                <form onSubmit={handleUnlockSolutions} className="space-y-3 text-left">
                  {solutionError && (
                    <div className="p-2.5 bg-rose-50 border-l-4 border-rose-500 text-xs text-rose-800 font-medium rounded-r">
                      {solutionError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Password Guru / Proktor
                    </label>
                    <div className="relative">
                      <input
                        id="input-password-pembahasan"
                        type={showPasswordText ? 'text' : 'password'}
                        value={solutionPasswordInput}
                        onChange={(e) => setSolutionPasswordInput(e.target.value)}
                        placeholder="Ketik password akses..."
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordText(!showPasswordText)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="btn-submit-unlock-solutions"
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    Buka Naskah Pembahasan
                  </button>
                </form>
              </div>
            ) : (
              /* Unlocked Solutions View */
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-bold text-emerald-900">
                      Naskah Kunci Jawaban & Pembahasan Lengkap (20 Butir Soal Rasio Fase D) Terbuka
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSolutionsUnlocked(false)}
                    className="text-xs text-emerald-800 underline font-semibold cursor-pointer"
                  >
                    Kunci Kembali 🔒
                  </button>
                </div>

                {/* 20 Questions Solutions Accordion/List */}
                <div className="space-y-4">
                  {EXAM_QUESTIONS.map((q, idx) => (
                    <div key={q.id} className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <div>
                          <span className="bg-blue-100 text-blue-900 font-extrabold text-xs px-2.5 py-0.5 rounded mr-2">
                            SOAL NO. {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-700 uppercase">
                            {q.type === 'pg' ? 'Pilihan Ganda' : q.type === 'pg_kompleks' ? 'Pilihan Ganda Kompleks' : 'Benar - Salah'}
                          </span>
                          <div className="text-xs text-slate-500 mt-1">
                            Indikator {q.indicator}: {q.indicatorTitle} • Level: <strong className="uppercase">{q.cognitiveLevel}</strong>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                          Kunci: {q.type === 'pg' ? q.correctOption : q.type === 'pg_kompleks' ? 'Multi-Opsi' : 'Tabel B/S'}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-900">
                        {q.questionText}
                      </div>

                      {/* Explanation Box */}
                      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-950 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-blue-900">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Pembahasan & Logika Penyelesaian:</span>
                        </div>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: KODE GOOGLE APPS SCRIPT & PANDUAN LENGKAP */}
        {/* ==================================================== */}
        {activeTab === 'appscript' && (
          <div className="space-y-6">
            {/* Guide & Answers to the User's 3 Specific Questions */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Jawaban & Panduan Integrasi Google Spreadsheet & Apps Script</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 space-y-1.5">
                  <div className="font-bold text-blue-900 flex items-center gap-1">
                    <span>1. Koneksi & Indikator</span>
                  </div>
                  <p className="text-slate-700">
                    Aplikasi menggunakan parameter <code>?action=ping</code> via method <code>doGet()</code>. Saat sukses merespon, indikator berwarna hijau <strong>Terhubung</strong> akan menyala di header & kartu login.
                  </p>
                </div>

                <div className="bg-emerald-50 p-3.5 rounded-lg border border-emerald-200 space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1">
                    <span>2. Penyimpanan Hasil Ujian</span>
                  </div>
                  <p className="text-slate-700">
                    Fungsi <code>doPost()</code> menerima JSON payload berisikan: Nama peserta, Kelas, Waktu pengerjaan, Jawaban tiap nomor (1-20), dan Skor akhir, lalu otomatis menambahkannya ke sheet <code>JawabanUjian</code>.
                  </p>
                </div>

                <div className="bg-amber-50 p-3.5 rounded-lg border border-amber-200 space-y-1.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1">
                    <span>3. Sambungan Data Siswa & Token</span>
                  </div>
                  <p className="text-slate-700">
                    Setiap entri hasil ujian mencantumkan <strong>Kode Siswa</strong>, <strong>Nama Peserta</strong>, dan <strong>Token Ujian</strong> yang digunakan saat login. Sheet <code>UserLogin</code> juga dapat ditarik langsung.
                  </p>
                </div>
              </div>

              {/* 4-Step Tutorial */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                <div className="font-bold text-slate-800">
                  Langkah Pemasangan Google Apps Script (Hanya 3 Menit):
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
                  <li>Buka Google Spreadsheet baru di browser Anda (atau gunakan spreadsheet sekolah).</li>
                  <li>Klik menu <strong>Extensions (Ekstensi)</strong> &gt; <strong>Apps Script</strong>.</li>
                  <li>Hapus seluruh kode default di <code>Code.gs</code>, lalu <strong>Paste (Tempel)</strong> kode di bawah ini.</li>
                  <li>Klik tombol <strong>Deploy (Terapkan)</strong> di pojok kanan atas &gt; pilih <strong>New deployment (Penerapan baru)</strong>.</li>
                  <li>Pilih jenis <strong>Web app</strong>, atur <em>Execute as: Me</em>, dan <em>Who has access: Anyone (Siapa saja)</em>.</li>
                  <li>Salin <strong>Web app URL</strong> yang dihasilkan, lalu masukkan ke tab <strong>Pengaturan Ujian</strong> di panel ini.</li>
                </ol>
              </div>
            </div>

            {/* Code Box with 1-Click Copy */}
            <div className="bg-slate-900 text-slate-100 rounded-xl shadow-lg overflow-hidden border border-slate-800">
              <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-slate-200">
                    Code.gs (Google Apps Script Lengkap)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors cursor-pointer"
                >
                  {hasCopiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Kode Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode (Copy)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                <pre className="font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
                  {APPSCRIPT_CODE}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Detail Jawaban Siswa */}
      {selectedResultForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#0f4c81] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">
                  Rincian Jawaban: {selectedResultForDetail.studentName}
                </h3>
                <p className="text-xs text-blue-200 font-mono">
                  {selectedResultForDetail.studentCode} • Kelas {selectedResultForDetail.classRoom} • Skor: {selectedResultForDetail.score}/100
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedResultForDetail(null)}
                className="text-white hover:text-rose-200 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Jumlah Benar:</span>{' '}
                  <strong className="text-emerald-700">{selectedResultForDetail.correctCount} Soal</strong>
                </div>
                <div>
                  <span className="text-slate-500">Total Soal:</span>{' '}
                  <strong>{selectedResultForDetail.totalQuestions} Soal</strong>
                </div>
                <div>
                  <span className="text-slate-500">Durasi:</span>{' '}
                  <strong>{selectedResultForDetail.durationMinutes} Menit</strong>
                </div>
                <div>
                  <span className="text-slate-500">Token:</span>{' '}
                  <strong className="font-mono text-blue-700">{selectedResultForDetail.token}</strong>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 w-12 text-center">No</th>
                      <th className="p-2">Tipe Soal</th>
                      <th className="p-2">Jawaban Siswa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((no) => {
                      const ans = selectedResultForDetail.answersSummary?.[no];
                      return (
                        <tr key={no} className={no % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                          <td className="p-2 text-center font-bold text-slate-600">{no}</td>
                          <td className="p-2 text-slate-500">
                            {no <= 8 ? 'PG Biasa' : no <= 16 ? 'PG Kompleks' : 'Benar-Salah'}
                          </td>
                          <td className="p-2 font-mono text-blue-900">
                            {ans === undefined || ans === null
                              ? '-'
                              : typeof ans === 'object'
                              ? JSON.stringify(ans)
                              : String(ans)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-100 p-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedResultForDetail(null)}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Siswa */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-2">
              Tambah Data Siswa Peserta Ujian
            </h3>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kode / NISN *</label>
                <input
                  type="text"
                  value={newUser.code}
                  onChange={(e) => setNewUser({ ...newUser, code: e.target.value })}
                  placeholder="Contoh: 7A-010"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nama Siswa..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Username Login *</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Username..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="text"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Kelas *</label>
                <select
                  value={newUser.classRoom}
                  onChange={(e) => setNewUser({ ...newUser, classRoom: e.target.value as '7A' | '7B' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="7A">Kelas 7A</option>
                  <option value="7B">Kelas 7B</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
