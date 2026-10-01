import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { formatDateTimeInput } from '../../../../shared/utils/date-time';
import {
  CreateLessonRequest,
  Lesson,
  LessonMode,
  lessonModeValues,
} from '../../../lessons/data-access/lesson.model';
import { LessonsApiService } from '../../../lessons/data-access/lessons-api.service';
import { Student } from '../../data-access/student.model';
import { StudentsApiService } from '../../data-access/students-api.service';

interface LessonForm {
  date: string;
  durationInMinutes: number;
  mode: LessonMode;
  isPaid: boolean;
}

@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './student-details.component.html',
})
export class StudentDetailsComponent implements OnInit {
  private readonly studentsApi = inject(StudentsApiService);
  private readonly lessonsApi = inject(LessonsApiService);
  private readonly route = inject(ActivatedRoute);

  readonly displayedColumns = ['date', 'duration', 'mode', 'payment', 'actions'];

  readonly lessonModeLabels: Record<number, string> = {
    0: 'Online',
    1: 'U tutora',
    2: 'U ucznia',
  };

  readonly student = signal<Student | null>(null);
  readonly lessons = signal<Lesson[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  lessonForm: LessonForm = {
    date: formatDateTimeInput(new Date()),
    durationInMinutes: 60,
    mode: 'Online',
    isPaid: false,
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
      student: this.studentsApi.getById(studentId),
      lessons: this.studentsApi.getLessons(studentId),
    }).subscribe({
      next: (data) => {
        this.student.set(data.student);
        this.lessons.set(data.lessons);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać danych ucznia.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    const studentId = this.student()?.id;

    if (!this.lessonForm.date || !studentId) {
      return;
    }

    const payload: CreateLessonRequest = {
      date: new Date(this.lessonForm.date).toISOString(),
      durationInMinutes: Number(this.lessonForm.durationInMinutes),
      mode: lessonModeValues[this.lessonForm.mode],
      isPaid: Boolean(this.lessonForm.isPaid),
      studentId: Number(studentId),
    };

    this.lessonsApi.create(payload).subscribe({
      next: () => {
        this.lessonForm = {
          date: formatDateTimeInput(new Date()),
          durationInMinutes: 60,
          mode: 'Online',
          isPaid: false,
        };
        this.loadStudentData();
      },
      error: () => {
        this.error.set('Nie udało się dodać lekcji.');
      },
    });
  }

  deleteLesson(lessonId: number): void {
    this.lessonsApi.delete(lessonId).subscribe({
      next: () => {
        const studentId = this.student()?.id;

        if (studentId) {
          this.loadStudentData();
          return;
        }

        this.lessons.update((currentLessons) =>
          currentLessons.filter((lesson) => lesson.id !== lessonId),
        );
      },
      error: () => {
        this.error.set('Nie udało się usunąć lekcji.');
      },
    });
  }

  getModeLabel(mode: number): string {
    return this.lessonModeLabels[mode] ?? 'Nieznany';
  }
}
