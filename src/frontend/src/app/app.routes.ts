import { Routes } from '@angular/router';
import { StudentListComponent } from './features/student/student-list.component';
import { LessonListComponent } from './features/lesson/lesson-list.component';

export const routes: Routes = [
  { path: 'students', component: StudentListComponent },
  { path: 'lessons', component: LessonListComponent }
];