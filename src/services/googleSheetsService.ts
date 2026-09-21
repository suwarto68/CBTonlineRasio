import { ExamResult, StudentUser } from '../types';

export interface ConnectionStatus {
  isConnected: boolean;
  status: 'idle' | 'checking' | 'connected' | 'error' | 'offline_mode';
  message: string;
  spreadsheetName?: string;
  lastChecked?: string;
}

export const STORAGE_KEYS = {
  SETTINGS: 'cbt_anbk_settings_v1',
  STUDENTS: 'cbt_anbk_students_v1',
  RESULTS: 'cbt_anbk_results_v1',
  CONNECTION: 'cbt_anbk_connection_v1',
};

// Default Settings
export const DEFAULT_SETTINGS = {
  schoolName: 'SMP Negeri 1 Wanaraya',
  academicYear: '2026/2027',
  subjectName: 'Matematika Fase D - Bilangan & Rasio',
  examDurationMinutes: 80,
  activeToken: 'ANBK2026',
  appScriptUrl: 'https://script.google.com/macros/s/AKfycbz_sample_endpoint/exec',
  spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  logoUrl: 'https://ibb.co.com/S4095CCm'
};

export async function testGoogleScriptConnection(scriptUrl: string): Promise<ConnectionStatus> {
  if (!scriptUrl || scriptUrl.includes('sample_endpoint') || !scriptUrl.startsWith('http')) {
    return {
      isConnected: false,
      status: 'offline_mode',
      message: 'Mode Mandiri / Lokal (Masukkan URL Google Apps Script di Pengaturan Admin untuk sinkronisasi otomatis).',
      lastChecked: new Date().toLocaleTimeString('id-ID')
    };
  }

  try {
    const pingUrl = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}action=ping&_t=${Date.now()}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(pingUrl, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 'success') {
      return {
        isConnected: true,
        status: 'connected',
        message: data.message || 'Berhasil terhubung ke Google Spreadsheet',
        spreadsheetName: data.spreadsheetName || 'Spreadsheet Sekolah',
        lastChecked: new Date().toLocaleTimeString('id-ID')
      };
    } else {
      return {
        isConnected: false,
        status: 'error',
        message: data.message || 'Gagal tersambung ke spreadsheet',
        lastChecked: new Date().toLocaleTimeString('id-ID')
      };
    }
  } catch (err: any) {
    console.warn('Google Sheets connection check failed:', err);
    return {
      isConnected: false,
      status: 'error',
      message: `Tidak dapat menjangkau Apps Script (${err.message || 'Koneksi timeout/CORS'}). Mode offline diaktifkan.`,
      lastChecked: new Date().toLocaleTimeString('id-ID')
    };
  }
}

export async function fetchStudentsFromSheet(scriptUrl: string): Promise<{ success: boolean; data?: StudentUser[]; message: string }> {
  if (!scriptUrl || scriptUrl.includes('sample_endpoint')) {
    return {
      success: false,
      message: 'URL Google Apps Script belum dikonfigurasi. Silakan masukkan URL Web App yang valid di Pengaturan.'
    };
  }

  try {
    const fetchUrl = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}action=getUsers&_t=${Date.now()}`;
    const res = await fetch(fetchUrl, {
      method: 'GET',
      mode: 'cors'
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.users)) {
      return {
        success: true,
        data: json.users,
        message: `Berhasil menarik ${json.users.length} data siswa dari sheet 'UserLogin'.`
      };
    } else {
      return {
        success: false,
        message: json.message || 'Data format tidak sesuai dari sheet UserLogin.'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menarik data dari Google Spreadsheet: ${err.message || 'Network error'}`
    };
  }
}

export async function submitExamResultToSheet(
  scriptUrl: string,
  result: ExamResult
): Promise<{ success: boolean; message: string }> {
  // Always save locally first!
  saveResultLocally(result);

  if (!scriptUrl || scriptUrl.includes('sample_endpoint')) {
    return {
      success: true,
      message: 'Hasil ujian disimpan di penyimpanan lokal browser (Mode Offline). Anda dapat menyinkronkannya dari halaman Admin.'
    };
  }

  try {
    const payload = JSON.stringify(result);
    // Use standard fetch or sendBeacon
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script redirects require handling or no-cors
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: payload
    });

    // Mark as synced locally
    markResultAsSynced(result.id);

    return {
      success: true,
      message: 'Hasil ujian berhasil dikirim dan dicatat ke Google Spreadsheet (sheet JawabanUjian)!'
    };
  } catch (err: any) {
    console.error('Failed to submit exam to Google Sheet:', err);
    return {
      success: false,
      message: `Gagal mengirim ke Google Sheets: ${err.message}. Hasil telah diamankan di penyimpanan lokal.`
    };
  }
}

export function getStoredResults(): ExamResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResultLocally(result: ExamResult) {
  try {
    const existing = getStoredResults();
    const updated = [result, ...existing.filter(r => r.id !== result.id)];
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving result locally', e);
  }
}

export function markResultAsSynced(resultId: string) {
  try {
    const existing = getStoredResults();
    const updated = existing.map(r => r.id === resultId ? { ...r, syncedToSheets: true, syncTimestamp: new Date().toISOString() } : r);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Error updating sync status', e);
  }
}
