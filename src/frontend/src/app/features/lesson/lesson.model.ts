export type LessonMode = 'Online' | 'AtTutor' | 'AtStudent';

export interface Lesson {
  id: number;
  date: string;
  durationInMinutes: number;
  mode: number;
  isPaid: boolean;
  studentId: number;
}
