/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  StudentUser,
  Question,
  UserAnswer,
  ExamResult,
  AppSettings
} from './types';
import { EXAM_QUESTIONS } from './data/questions';
import { INITIAL_STUDENTS } from './data/mockStudents';
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  ConnectionStatus,
  testGoogleScriptConnection,
  submitExamResultToSheet,
  getStoredResults
} from './services/googleSheetsService';
import { Header } from './components/Header';
import { LoginScreen } from './components/LoginScreen';
import { ExamConfirmationModal } from './components/ExamConfirmationModal';
import { ExamScreen } from './components/ExamScreen';
import { ResultScreen } from './components/ResultScreen';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  // App View Mode
  const [viewMode, setViewMode] = useState<'login' | 'confirmation' | 'exam' | 'result' | 'admin'>('login');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Students Database
  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Results History
  const [results, setResults] = useState<ExamResult[]>(() => getStoredResults());

  // Connection State
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    status: 'idle',
    message: 'Memeriksa status koneksi...'
  });

  // Active Session State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [activeToken, setActiveToken] = useState<string>('');
  const [examQuestions, setExamQuestions] = useState<Question[]>(EXAM_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(settings.examDurationMinutes * 60);
  const [examStartTime, setExamStartTime] = useState<string>('');
  const [latestResult, setLatestResult] = useState<ExamResult | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [isQuestionListOpen, setIsQuestionListOpen] = useState(false);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  // Timer Ref
  const timerRef = useRef<any>(null);

  // Check Connection on Mount
  useEffect(() => {
    checkConnection();
  }, [settings.appScriptUrl]);

  const checkConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, status: 'checking' }));
    const status = await testGoogleScriptConnection(settings.appScriptUrl);
    setConnectionStatus(status);
  };

  // Persist Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  // Persist Students
  const handleUpdateStudents = (newStudents: StudentUser[]) => {
    setStudents(newStudents);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
  };

  // Clear Results
  const handleClearResults = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua arsip hasil ujian?')) {
      setResults([]);
      localStorage.removeItem(STORAGE_KEYS.RESULTS);
    }
  };

  // Timer Countdown in Exam Mode
  useEffect(() => {
    if (viewMode === 'exam') {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewMode]);

  // Handle Login Success -> Move to Confirmation Modal
  const handleLoginSuccess = (user: StudentUser, token: string) => {
    setCurrentUser(user);
    setActiveToken(token);
    setViewMode('confirmation');
  };

  // Start Exam after Confirmation
  const handleStartExam = () => {
    // Randomize question order per student session
    const shuffled = [...EXAM_QUESTIONS].sort(() => Math.random() - 0.5);
    setExamQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeRemainingSeconds(settings.examDurationMinutes * 60);
    setExamStartTime(new Date().toLocaleTimeString('id-ID'));
    setViewMode('exam');
  };

  // Update an Answer
  const handleUpdateAnswer = (questionId: number, partialAns: Partial<UserAnswer>) => {
    setUserAnswers(prev => {
      const existing = prev[questionId] || {
        questionId,
        type: partialAns.type || 'pg',
        isDoubtful: false
      };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          ...partialAns
        }
      };
    });
  };

  // Finish Exam & Calculate Score
  const handleFinishExam = async () => {
    if (isSubmittingExam) return;
    setIsSubmittingExam(true);

    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let totalScore = 0;
    let correctCount = 0;
    const answersSummary: Record<number, any> = {};

    EXAM_QUESTIONS.forEach((q) => {
      const ans = userAnswers[q.id];
      let questionScore = 0; // Max 5 pts per question (20 questions * 5 = 100)

      if (!ans) {
        answersSummary[q.id] = '-';
        return;
      }

      if (q.type === 'pg') {
        answersSummary[q.id] = ans.selectedOption || '-';
        if (ans.selectedOption === q.correctOption) {
          questionScore = 5;
          correctCount++;
        }
      } else if (q.type === 'pg_kompleks') {
        const userSel = (ans.selectedComplexOptions || []).sort();
        answersSummary[q.id] = userSel.length > 0 ? userSel.join(';') : '-';
        const correctSet = (q.complexOptions || []).filter(o => o.isCorrect).map(o => o.id).sort();

        // Exact match of all correct items gets 5 pts, partial proportional credit
        const totalCorrect = correctSet.length;
        let matched = 0;
        let falseChecked = 0;

        userSel.forEach(id => {
          if (correctSet.includes(id)) matched++;
          else falseChecked++;
        });

        if (matched === totalCorrect && falseChecked === 0) {
          questionScore = 5;
          correctCount++;
        } else if (matched > 0 && falseChecked === 0) {
          questionScore = Math.max(0, (matched / totalCorrect) * 5);
        }
      } else if (q.type === 'benar_salah') {
        const userTF = ans.trueFalseAnswers || {};
        answersSummary[q.id] = userTF;
        const statements = q.trueFalseStatements || [];
        let tfCorrect = 0;

        statements.forEach(stmt => {
          if (userTF[stmt.id] === stmt.isTrue) {
            tfCorrect++;
          }
        });

        if (tfCorrect === statements.length) {
          questionScore = 5;
          correctCount++;
        } else {
          questionScore = (tfCorrect / statements.length) * 5;
        }
      }

      totalScore += questionScore;
    });

    const finalScore = Math.round(totalScore);
    const durationSpentMinutes = Math.max(
      1,
      Math.round((settings.examDurationMinutes * 60 - timeRemainingSeconds) / 60)
    );

    const resultData: ExamResult = {
      id: `EXAM-${Date.now()}-${currentUser?.code || 'GUEST'}`,
      studentCode: currentUser?.code || '-',
      studentName: currentUser?.name || 'Peserta',
      classRoom: currentUser?.classRoom || '7A',
      token: activeToken || settings.activeToken,
      startTime: examStartTime || new Date().toLocaleTimeString('id-ID'),
      endTime: new Date().toLocaleTimeString('id-ID'),
      durationMinutes: durationSpentMinutes,
      totalQuestions: EXAM_QUESTIONS.length,
      correctCount,
      score: finalScore,
      answersSummary,
      syncedToSheets: false
    };

    // Save & submit to Google Sheets
    setLatestResult(resultData);
    setResults(prev => [resultData, ...prev]);

    try {
      await submitExamResultToSheet(settings.appScriptUrl, resultData);
    } catch (e) {
      console.warn('Auto submit error:', e);
    }

    setIsSubmittingExam(false);
    setViewMode('result');
  };

  const handleAutoFinishExam = () => {
    alert('Waktu ujian telah habis! Jawaban Anda akan otomatis dikirim dan dinilai.');
    handleFinishExam();
  };

  // Logout Handler
  const handleLogout = () => {
    if (viewMode === 'exam') {
      if (!confirm('Apakah Anda yakin ingin keluar dari sesi ujian? Progres pengerjaan saat ini akan dibatalkan.')) {
        return;
      }
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentUser(null);
    setActiveToken('');
    setUserAnswers({});
    setViewMode('login');
  };

  // Calculate answered count
  const answeredCount = Object.values(userAnswers).filter(a =>
    Boolean(a.selectedOption) ||
    (a.selectedComplexOptions && a.selectedComplexOptions.length > 0) ||
    (a.trueFalseAnswers && Object.keys(a.trueFalseAnswers).length > 0)
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
      {/* Blue Header with School Logo, Timer, Controls */}
      <Header
        settings={settings}
        currentUser={currentUser}
        connectionStatus={connectionStatus}
        timeRemainingSeconds={timeRemainingSeconds}
        fontSize={fontSize}
        setFontSize={setFontSize}
        onLogout={handleLogout}
        onOpenQuestionList={() => setIsQuestionListOpen(true)}
        answeredCount={answeredCount}
        totalQuestions={examQuestions.length}
        isInExam={viewMode === 'exam'}
      />

      {/* Main Content Router */}
      <div className="flex-1 flex flex-col">
        {/* VIEW 1: LOGIN */}
        {viewMode === 'login' && (
          <LoginScreen
            settings={settings}
            students={students}
            connectionStatus={connectionStatus}
            onLoginSuccess={handleLoginSuccess}
            onGoToAdmin={() => setViewMode('admin')}
            onRefreshConnection={checkConnection}
          />
        )}

        {/* VIEW 2: EXAM CONFIRMATION */}
        {viewMode === 'confirmation' && currentUser && (
          <ExamConfirmationModal
            user={currentUser}
            token={activeToken}
            settings={settings}
            onStartExam={handleStartExam}
            onCancel={() => setViewMode('login')}
          />
        )}

        {/* VIEW 3: EXAM ACTIVE SCREEN */}
        {viewMode === 'exam' && currentUser && (
          <ExamScreen
            questions={examQuestions}
            currentIndex={currentIndex}
            answers={userAnswers}
            fontSize={fontSize}
            settings={settings}
            currentUser={currentUser}
            isSubmitting={isSubmittingExam}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
            onUpdateAnswer={handleUpdateAnswer}
            onFinishExam={handleFinishExam}
            onOpenQuestionList={() => setIsQuestionListOpen(true)}
            isQuestionListOpen={isQuestionListOpen}
            onCloseQuestionList={() => setIsQuestionListOpen(false)}
          />
        )}

        {/* VIEW 4: RESULT SCREEN */}
        {viewMode === 'result' && latestResult && (
          <ResultScreen
            result={latestResult}
            settings={settings}
            onLogout={handleLogout}
          />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {viewMode === 'admin' && (
          <AdminDashboard
            settings={settings}
            students={students}
            results={results}
            connectionStatus={connectionStatus}
            onUpdateSettings={handleUpdateSettings}
            onUpdateStudents={handleUpdateStudents}
            onClearResults={handleClearResults}
            onBackToApp={() => setViewMode('login')}
            onRefreshConnection={checkConnection}
          />
        )}
      </div>
    </div>
  );
}
