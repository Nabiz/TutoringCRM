import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { Lesson } from '../../data-access/lesson.model';

@Component({
  selector: 'app-lesson-table',
  imports: [DatePipe, MatButtonModule, MatListModule, MatTableModule],
  templateUrl: './lesson-table.component.html',
})
export class LessonTableComponent {
  readonly lessons = input.required<Lesson[]>();
  readonly showStudentColumn = input(false);
  readonly tableLabel = input('Lista lekcji');
  readonly emptyMessage = input('Brak lekcji.');
  readonly pendingPaymentIds = input<readonly number[]>([]);
  readonly paymentConfirmationRequested = output<number>();
  readonly deleteRequested = output<number>();

  protected readonly displayedColumns = computed(() => [
    'date',
    'duration',
    'mode',
    'payment',
    ...(this.showStudentColumn() ? ['student'] : []),
    'actions',
  ]);

  private readonly lessonModeLabels: Record<number, string> = {
    0: 'Online',
    1: 'U tutora',
    2: 'U ucznia',
  };

  protected getModeLabel(mode: number): string {
    return this.lessonModeLabels[mode] ?? 'Nieznany';
  }
}
