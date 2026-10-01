import { Component, OnInit, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { formatDateTimeInput } from '../../../../shared/utils/date-time';
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
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './lesson-list.component.html',
})
export class LessonListComponent implements OnInit {
  private readonly lessonsApi = inject(LessonsApiService);

  readonly displayedColumns = ['date', 'duration', 'mode', 'payment', 'student', 'actions'];

  readonly lessonModeLabels: Record<number, string> = {
    0: 'Online',
    1: 'AtTutor',
    2: 'AtStudent',
  };

  lessons = signal<Lesson[]>([]);
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

  getModeLabel(mode: number): string {
    return this.lessonModeLabels[mode] ?? 'Unknown';
  }
}
