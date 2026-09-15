import { Routes } from '@angular/router';
import { StudentListComponent } from './features/student/student-list.component';
import { StudentDetailsComponent } from './features/student-details/student-details.component';
import { LessonListComponent } from './features/lesson/lesson-list.component';

export const routes: Routes = [
  { path: 'students', component: StudentListComponent },
  { path: 'students/:id', component: StudentDetailsComponent },
  { path: 'lessons', component: LessonListComponent }
];