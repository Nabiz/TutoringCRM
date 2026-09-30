import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
import { Lesson, LessonMode } from './lesson.model';

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
    MatTableModule
  ],
  templateUrl: './lesson-list.component.html'
})
export class LessonListComponent implements OnInit {
  private http = inject(HttpClient);
  private lessonUrl = 'http://localhost:8080/api/lessons';

  readonly displayedColumns = ['date', 'duration', 'mode', 'payment', 'student', 'actions'];

  readonly lessonModeLabels: Record<number, string> = {
    0: 'Online',
    1: 'AtTutor',
    2: 'AtStudent'
  };

  lessons = signal<Lesson[]>([]);
  lessonForm: LessonForm = {
    date: this.formatDateTimeInput(new Date()),
    durationInMinutes: 60,
    mode: 'Online',
    isPaid: false,
    studentId: 1
  };

  ngOnInit() {
    this.loadLessons();
  }

  loadLessons() {
    this.http.get<Lesson[]>(this.lessonUrl).subscribe((data) => {
      this.lessons.set(data);
    });
  }

  deleteLesson(lessonId: number) {
    this.http.delete(`${this.lessonUrl}/${lessonId}`).subscribe(() => {
      this.loadLessons();
    });
  }

  onSubmit() {
    if (!this.lessonForm.date || !this.lessonForm.studentId) {
      return;
    }

    const payload = {
      date: new Date(this.lessonForm.date).toISOString(),
      durationInMinutes: Number(this.lessonForm.durationInMinutes),
      mode: this.getModeValue(this.lessonForm.mode),
      isPaid: Boolean(this.lessonForm.isPaid),
      studentId: Number(this.lessonForm.studentId)
    };

    this.http.post<Lesson>(this.lessonUrl, payload).subscribe(() => {
      this.lessonForm = {
        date: this.formatDateTimeInput(new Date()),
        durationInMinutes: 60,
        mode: 'Online',
        isPaid: false,
        studentId: 1
      };
      this.loadLessons();
    });
  }

  getModeLabel(mode: number): string {
    return this.lessonModeLabels[mode] ?? 'Unknown';
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
