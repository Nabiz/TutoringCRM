export type LessonMode = 'Online' | 'AtTutor' | 'AtStudent';

export const lessonModeValues: Record<LessonMode, number> = {
  Online: 0,
  AtTutor: 1,
  AtStudent: 2,
};

export interface Lesson {
  id: number;
  date: string;
  durationInMinutes: number;
  mode: number;
  isPaid: boolean;
  studentId: number;
}

export interface CreateLessonRequest {
  date: string;
  durationInMinutes: number;
  mode: number;
  isPaid: boolean;
  studentId: number;
}
