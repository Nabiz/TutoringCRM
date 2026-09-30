import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Lesson, LessonMode } from '../lesson/lesson.model';
import { Student } from '../student/student.model';

interface LessonForm {
  date: string;
  durationInMinutes: number;
  mode: LessonMode;
  isPaid: boolean;
}

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './student-details.component.html'
})
export class StudentDetailsComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly studentsUrl = 'http://localhost:8080/api/students';
  private readonly lessonsUrl = 'http://localhost:8080/api/lessons';

  readonly lessonModeLabels: Record<number, string> = {
    0: 'Online',
    1: 'U tutora',
    2: 'U ucznia'
  };

  readonly student = signal<Student | null>(null);
  readonly lessons = signal<Lesson[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  lessonForm: LessonForm = {
    date: this.formatDateTimeInput(new Date()),
    durationInMinutes: 60,
    mode: 'Online',
    isPaid: false
  };

  ngOnInit(): void {
    this.loadStudentData();
  }

  loadStudentData(): void {
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

  onSubmit(): void {
    const studentId = this.student()?.id;

    if (!this.lessonForm.date || !studentId) {
      return;
    }

    const payload = {
      date: new Date(this.lessonForm.date).toISOString(),
      durationInMinutes: Number(this.lessonForm.durationInMinutes),
      mode: this.getModeValue(this.lessonForm.mode),
      isPaid: Boolean(this.lessonForm.isPaid),
      studentId: Number(studentId)
    };

    this.http.post<Lesson>(this.lessonsUrl, payload).subscribe({
      next: () => {
        this.lessonForm = {
          date: this.formatDateTimeInput(new Date()),
          durationInMinutes: 60,
          mode: 'Online',
          isPaid: false
        };
        this.loadStudentData();
      },
      error: () => {
        this.error.set('Nie udało się dodać lekcji.');
      }
    });
  }

  deleteLesson(lessonId: number): void {
    this.http.delete(`${this.lessonsUrl}/${lessonId}`).subscribe({
      next: () => {
        const studentId = this.student()?.id;

        if (studentId) {
          this.loadStudentData();
          return;
        }

        this.lessons.update((currentLessons) => currentLessons.filter((lesson) => lesson.id !== lessonId));
      },
      error: () => {
        this.error.set('Nie udało się usunąć lekcji.');
      }
    });
  }

  getModeLabel(mode: number): string {
    return this.lessonModeLabels[mode] ?? 'Nieznany';
  }

  private getModeValue(mode: LessonMode): number {
    const values: Record<LessonMode, number> = {
      Online: 0,
      AtTutor: 1,
      AtStudent: 2
    };

    return values[mode];
  }

  private formatDateTimeInput(date: Date): string {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }
}