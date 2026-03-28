import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentRequest, StudentResponse } from '../models/Student';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = '/api/students';

  findAll(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.baseUrl);
  }

  findById(id: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${id}`);
  }

  create(student: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.baseUrl, student);
  }

  update(id: number, student: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.baseUrl}/${id}`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
