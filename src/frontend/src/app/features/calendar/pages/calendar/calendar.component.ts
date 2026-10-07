import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { Lesson } from '../../../lessons/data-access/lesson.model';
import { LessonsApiService } from '../../../lessons/data-access/lessons-api.service';

interface CalendarLessonsState {
  month: Date;
  lessons: Lesson[];
  loading: boolean;
  error: string;
}

@Component({
  selector: 'app-calendar',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatListModule,
    MatProgressBarModule,
  ],
  templateUrl: './calendar.component.html',
})
export class CalendarComponent {
  private readonly lessonsApi = inject(LessonsApiService);
  private readonly reloadRequested = new Subject<void>();
  protected readonly weekdays = ['Pon.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sob.', 'Niedz.'];
  protected readonly visibleMonth = signal(new Date(2026, 9, 1));

  private readonly loadedLessonsState = toSignal(
    combineLatest([
      toObservable(this.visibleMonth),
      this.reloadRequested.pipe(startWith(undefined)),
    ]).pipe(
      switchMap(([month]) => {
        const from = new Date(month.getFullYear(), month.getMonth(), 1);
        const to = new Date(month.getFullYear(), month.getMonth() + 1, 1);

        return this.lessonsApi.getByDateRange(from, to).pipe(
          map((lessons): CalendarLessonsState => ({ month, lessons, loading: false, error: '' })),
          catchError(() =>
            of<CalendarLessonsState>({
              month,
              lessons: [],
              loading: false,
              error: 'Nie udało się pobrać lekcji.',
            }),
          ),
          startWith<CalendarLessonsState>({ month, lessons: [], loading: true, error: '' }),
        );
      }),
    ),
    { initialValue: { month: this.visibleMonth(), lessons: [], loading: true, error: '' } },
  );

  protected readonly lessonsState = computed<CalendarLessonsState>(() => {
    const state = this.loadedLessonsState();
    const month = this.visibleMonth();
    return state.month.getTime() === month.getTime()
      ? state
      : { month, lessons: [], loading: true, error: '' };
  });

  protected readonly lessonsByDay = computed(() => {
    const month = this.visibleMonth();
    const groups = new Map<number, Lesson[]>();

    for (const lesson of this.lessonsState().lessons) {
      const date = new Date(lesson.date);
      if (date.getFullYear() !== month.getFullYear() || date.getMonth() !== month.getMonth()) {
        continue;
      }

      const day = date.getDate();
      const lessons = groups.get(day) ?? [];
      lessons.push(lesson);
      groups.set(day, lessons);
    }

    return groups;
  });

  protected readonly rowHeight = computed(() => {
    const maximumLessons = Math.max(
      0,
      ...Array.from(this.lessonsByDay().values(), (lessons) => lessons.length),
    );
    return `${100 + 64 * maximumLessons}px`;
  });

  private readonly monthFormatter = new Intl.DateTimeFormat('pl-PL', {
    month: 'long',
    year: 'numeric',
  });
  private readonly dayFormatter = new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  protected readonly monthLabel = computed(() => {
    const label = this.monthFormatter.format(this.visibleMonth());
    return label.charAt(0).toUpperCase() + label.slice(1);
  });

  protected readonly days = computed<(number | null)[]>(() => {
    const firstDay = this.visibleMonth();
    const daysInMonth = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0).getDate();
    const leadingEmptyDays = (firstDay.getDay() + 6) % 7;
    const totalCells = Math.ceil((leadingEmptyDays + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const day = index - leadingEmptyDays + 1;
      return day >= 1 && day <= daysInMonth ? day : null;
    });
  });

  protected changeMonth(offset: number): void {
    this.visibleMonth.update(
      (month) => new Date(month.getFullYear(), month.getMonth() + offset, 1),
    );
  }

  protected reloadLessons(): void {
    this.reloadRequested.next();
  }

  protected dayLabel(day: number): string {
    const month = this.visibleMonth();
    return this.dayFormatter.format(new Date(month.getFullYear(), month.getMonth(), day));
  }
}
