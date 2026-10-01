import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CreateStudentRequest, Student } from '../../data-access/student.model';
import { StudentsApiService } from '../../data-access/students-api.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
  templateUrl: './student-list.component.html',
})
export class StudentListComponent implements OnInit {
  private readonly studentsApi = inject(StudentsApiService);

  students = signal<Student[]>([]);
  studentForm: CreateStudentRequest = {
    firstName: '',
    lastName: '',
    grade: 1,
  };

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentsApi.getAll().subscribe((data) => {
      this.students.set(data);
    });
  }

  onSubmit() {
    const payload = {
      firstName: this.studentForm.firstName.trim(),
      lastName: this.studentForm.lastName.trim(),
      grade: Number(this.studentForm.grade),
    };

    if (!payload.firstName || !payload.lastName) {
      return;
    }

    this.studentsApi.create(payload).subscribe(() => {
      this.studentForm = { firstName: '', lastName: '', grade: 1 };
      this.loadStudents();
    });
  }
}
