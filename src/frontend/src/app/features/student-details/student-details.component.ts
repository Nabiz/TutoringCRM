import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Lesson } from '../lesson/lesson.model';
import { Student } from '../student/student.model';

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './student-details.component.html'
})
export class StudentDetailsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly studentsUrl = 'http://localhost:8080/api/students';

  readonly lessonModeLabels: Record<number, string> = {
    0: 'Online',
    1: 'U tutora',
    2: 'U ucznia'
  };

  readonly student = signal<Student | null>(null);
  readonly lessons = signal<Lesson[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const studentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(studentId) || studentId < 1) {
      this.error.set('Nieprawidłowy identyfikator ucznia.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      student: this.http.get<Student>(`${this.studentsUrl}/${studentId}`),
      lessons: this.http.get<Lesson[]>(`${this.studentsUrl}/${studentId}/lessons`)
    }).subscribe({
      next: (data) => {
        this.student.set(data.student);
        this.lessons.set(data.lessons);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać danych ucznia.');
        this.loading.set(false);
      }
    });
  }

  getModeLabel(mode: number): string {
    return this.lessonModeLabels[mode] ?? 'Nieznany';
  }
}