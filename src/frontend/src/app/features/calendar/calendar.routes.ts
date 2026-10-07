import { Routes } from '@angular/router';

export const calendarRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent),
  },
];
