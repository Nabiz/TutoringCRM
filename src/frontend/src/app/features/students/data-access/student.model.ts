export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  grade: number;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  grade: number;
}
