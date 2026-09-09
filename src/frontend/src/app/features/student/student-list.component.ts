import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from './student.model';

@Component({
  selector: 'app-student-list',
  standalone: true,
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  private http = inject(HttpClient);
  private studentUrl = 'http://localhost:5258/api/students';
  
  students = signal<Student[]>([]);

  ngOnInit() {
    this.http.get<Student[]>(this.studentUrl)
      .subscribe(data => this.students.set(data));
  }
}