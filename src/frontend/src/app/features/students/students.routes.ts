import { Routes } from '@angular/router';

export const studentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/student-list/student-list.component').then((m) => m.StudentListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/student-details/student-details.component').then(
        (m) => m.StudentDetailsComponent,
      ),
  },
];
