export type QuestionType = 'pg' | 'pg_kompleks' | 'benar_salah';

export type CognitiveLevel = 'pemahaman' | 'aplikasi' | 'penalaran';

export interface ComplexOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean; // true = Benar, false = Salah
}

export interface Question {
  id: number;
  indicator: '3.1' | '3.2' | '3.3' | '3.4';
  indicatorTitle: string;
  cognitiveLevel: CognitiveLevel;
  type: QuestionType;
  stimulusTitle: string;
  stimulusText: string;
  stimulusGraphicType?: 'table' | 'map' | 'chart' | 'recipe' | 'infographic';
  stimulusData?: any;
  questionText: string;
  // For PG biasa (1 jawaban benar)
  options?: { id: string; text: string }[];
  correctOption?: string;
  // For PG kompleks (jawaban lebih dari satu, 4 pernyataan)
  complexOptions?: ComplexOption[];
  // For Benar - Salah (3 pernyataan)
  trueFalseStatements?: TrueFalseStatement[];
  explanation: string;
}

export interface StudentUser {
  code: string; // Kode / NISN
  name: string;
  username: string;
  password?: string;
  classRoom: '7A' | '7B';
}

export interface UserAnswer {
  questionId: number;
  type: QuestionType;
  selectedOption?: string; // For PG
  selectedComplexOptions?: string[]; // For PG Kompleks
  trueFalseAnswers?: Record<string, boolean>; // For Benar-Salah { [statementId]: boolean }
  isDoubtful: boolean; // Ragu-ragu
}

export interface ExamResult {
  id: string;
  studentCode: string;
  studentName: string;
  classRoom: string;
  token: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  totalQuestions: number;
  correctCount: number;
  score: number; // 0 - 100
  answersSummary: Record<number, any>;
  syncedToSheets: boolean;
  syncTimestamp?: string;
}

export interface AppSettings {
  schoolName: string;
  academicYear: string;
  subjectName: string;
  examDurationMinutes: number;
  activeToken: string;
  appScriptUrl: string;
  spreadsheetId: string;
  logoUrl: string;
}
