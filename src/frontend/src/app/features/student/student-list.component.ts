import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Student } from './student.model';

interface StudentForm {
  firstName: string;
  lastName: string;
  grade: number;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  private http = inject(HttpClient);
  private studentUrl = 'http://localhost:8080/api/students';

  students = signal<Student[]>([]);
  studentForm: StudentForm = {
    firstName: '',
    lastName: '',
    grade: 1
  };

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.http.get<Student[]>(this.studentUrl).subscribe((data) => {
      this.students.set(data);
    });
  }

  onSubmit() {
    const payload = {
      firstName: this.studentForm.firstName.trim(),
      lastName: this.studentForm.lastName.trim(),
      grade: Number(this.studentForm.grade)
    };

    if (!payload.firstName || !payload.lastName) {
      return;
    }

    this.http.post<Student>(this.studentUrl, payload).subscribe(() => {
      this.studentForm = { firstName: '', lastName: '', grade: 1 };
      this.loadStudents();
    });
  }
}