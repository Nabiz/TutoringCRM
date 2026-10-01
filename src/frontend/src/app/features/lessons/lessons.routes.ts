import { Routes } from '@angular/router';

export const lessonsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/lesson-list/lesson-list.component').then((m) => m.LessonListComponent),
  },
];
