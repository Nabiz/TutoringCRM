import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
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
  imports: [FormsModule, DatePipe],
  templateUrl: './lesson-list.component.html'
})
export class LessonListComponent implements OnInit {
  private http = inject(HttpClient);
  private lessonUrl = 'http://localhost:8080/api/lessons';

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
