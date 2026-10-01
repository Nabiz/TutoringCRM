import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { CreateLessonRequest, Lesson } from './lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonsApiService {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_BASE_URL)}/lessons`;

  getAll(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.url);
  }

  create(lesson: CreateLessonRequest): Observable<Lesson> {
    return this.http.post<Lesson>(this.url, lesson);
  }

  confirmPayment(lessonId: number): Observable<Lesson> {
    return this.http.post<Lesson>(`${this.url}/${lessonId}/confirm-payment`, null);
  }

  delete(lessonId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${lessonId}`);
  }
}
