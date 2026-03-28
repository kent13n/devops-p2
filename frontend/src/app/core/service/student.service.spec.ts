import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { StudentService } from './student.service';
import { StudentRequest } from '../models/Student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('findAll should GET /api/students', () => {
    service.findAll().subscribe(students => {
      expect(students).toHaveLength(1);
    });
    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com' }]);
  });

  it('findById should GET /api/students/1', () => {
    service.findById(1).subscribe(student => {
      expect(student.id).toBe(1);
    });
    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com' });
  });

  it('create should POST /api/students', () => {
    const body: StudentRequest = { firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com' };
    service.create(body).subscribe();
    const req = httpMock.expectOne('/api/students');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('update should PUT /api/students/1', () => {
    const body: StudentRequest = { firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com' };
    service.update(1, body).subscribe();
    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush({});
  });

  it('delete should DELETE /api/students/1', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne('/api/students/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
