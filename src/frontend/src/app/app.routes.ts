import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  {
    path: 'students',
    loadChildren: () => import('./features/students/students.routes').then((m) => m.studentsRoutes),
  },
  {
    path: 'lessons',
    loadChildren: () => import('./features/lessons/lessons.routes').then((m) => m.lessonsRoutes),
  },
  {
    path: 'calendar',
    loadChildren: () => import('./features/calendar/calendar.routes').then((m) => m.calendarRoutes),
  },
];
