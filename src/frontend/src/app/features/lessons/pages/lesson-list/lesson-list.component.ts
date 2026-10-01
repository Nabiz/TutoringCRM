import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { formatDateTimeInput } from '../../../../shared/utils/date-time';
import { LessonTableComponent } from '../../components/lesson-table/lesson-table.component';
import {
  CreateLessonRequest,
  Lesson,
  LessonMode,
  lessonModeValues,
} from '../../data-access/lesson.model';
import { LessonsApiService } from '../../data-access/lessons-api.service';

interface LessonForm {
  date: string;
  durationInMinutes: number;
  mode: LessonMode;
  isPaid: boolean;
  studentId: number;
}

@Component({
  selector: 'app-lesson-list',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    LessonTableComponent,
  ],
  templateUrl: './lesson-list.component.html',
})
export class LessonListComponent implements OnInit {
  private readonly lessonsApi = inject(LessonsApiService);
  private readonly snackBar = inject(MatSnackBar);

  lessons = signal<Lesson[]>([]);
  readonly pendingPaymentIds = signal<number[]>([]);
  lessonForm: LessonForm = {
    date: formatDateTimeInput(new Date()),
    durationInMinutes: 60,
    mode: 'Online',
    isPaid: false,
    studentId: 1,
  };

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.lessonsApi.getAll().subscribe((data) => {
      this.lessons.set(data);
    });
  }

  confirmPayment(lessonId: number): void {
    if (this.pendingPaymentIds().includes(lessonId)) {
      return;
    }

    this.pendingPaymentIds.update((ids) => [...ids, lessonId]);
    this.lessonsApi
      .confirmPayment(lessonId)
      .pipe(
        finalize(() => this.pendingPaymentIds.update((ids) => ids.filter((id) => id !== lessonId))),
      )
      .subscribe({
        next: (updatedLesson) => {
          this.lessons.update((lessons) =>
            lessons.map((lesson) => (lesson.id === lessonId ? updatedLesson : lesson)),
          );
        },
        error: () => {
          this.snackBar.open('Nie udało się potwierdzić płatności. Spróbuj ponownie.', 'Zamknij', {
            duration: 5000,
          });
        },
      });
  }

  deleteLesson(lessonId: number) {
    this.lessonsApi.delete(lessonId).subscribe(() => {
      this.loadLessons();
    });
  }

  onSubmit() {
    if (!this.lessonForm.date || !this.lessonForm.studentId) {
      return;
    }

    const payload: CreateLessonRequest = {
      date: new Date(this.lessonForm.date).toISOString(),
      durationInMinutes: Number(this.lessonForm.durationInMinutes),
      mode: lessonModeValues[this.lessonForm.mode],
      isPaid: Boolean(this.lessonForm.isPaid),
      studentId: Number(this.lessonForm.studentId),
    };

    this.lessonsApi.create(payload).subscribe(() => {
      this.lessonForm = {
        date: formatDateTimeInput(new Date()),
        durationInMinutes: 60,
        mode: 'Online',
        isPaid: false,
        studentId: 1,
      };
      this.loadLessons();
    });
  }
}
