import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Lesson } from '../../lessons/data-access/lesson.model';
import { CreateStudentRequest, Student } from './student.model';

@Injectable({ providedIn: 'root' })
export class StudentsApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/students`;

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.url);
  }

  getById(studentId: number): Observable<Student> {
    return this.http.get<Student>(`${this.url}/${studentId}`);
  }

  getLessons(studentId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`${this.url}/${studentId}/lessons`);
  }

  create(student: CreateStudentRequest): Observable<Student> {
    return this.http.post<Student>(this.url, student);
  }

  delete(studentId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${studentId}`);
  }
}
