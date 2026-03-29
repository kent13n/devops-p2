import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialog } from '@angular/material/dialog';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { of, throwError } from 'rxjs';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentServiceSpy: jest.Mocked<StudentService>;
  let dialogSpy: jest.Mocked<MatDialog>;

  const mockStudents = [
    { id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com', created_at: '', updated_at: '' }
  ];

  beforeEach(async () => {
    studentServiceSpy = {
      findAll: jest.fn().mockReturnValue(of(mockStudents)),
      delete: jest.fn().mockReturnValue(of(void 0))
    } as any;
    dialogSpy = {
      open: jest.fn().mockReturnValue({ afterClosed: () => of(true) })
    } as any;

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    expect(studentServiceSpy.findAll).toHaveBeenCalled();
    expect(component.dataSource.data).toHaveLength(1);
    expect(component.loading).toBe(false);
  });

  it('should display add student button', () => {
    const btn = fixture.nativeElement.querySelector('a[routerLink="/students/create"]');
    expect(btn).toBeTruthy();
  });

  it('should set errorMessage on loadStudents failure', () => {
    studentServiceSpy.findAll.mockReturnValue(throwError(() => ({ error: { message: 'Erreur serveur' } })));
    component.loadStudents();
    expect(component.errorMessage).toBe('Erreur serveur');
    expect(component.loading).toBe(false);
  });

  it('should set loading false after successful load', () => {
    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('');
  });
});
