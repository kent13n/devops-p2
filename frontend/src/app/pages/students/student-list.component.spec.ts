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
  let dialog: MatDialog;

  const mockStudents = [
    { id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com', created_at: '', updated_at: '' }
  ];

  beforeEach(async () => {
    studentServiceSpy = {
      findAll: jest.fn().mockReturnValue(of(mockStudents)),
      delete: jest.fn().mockReturnValue(of(void 0))
    } as any;

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: StudentService, useValue: studentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
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

  it('should call delete and reload on deleteStudent confirmed', () => {
    // Accéder au dialog injecté dans le composant
    const dialogInstance = (component as any).dialog;
    jest.spyOn(dialogInstance, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);
    component.deleteStudent(mockStudents[0] as any);
    expect(studentServiceSpy.delete).toHaveBeenCalledWith(1);
  });

  it('should not delete when dialog is cancelled', () => {
    const dialogInstance = (component as any).dialog;
    jest.spyOn(dialogInstance, 'open').mockReturnValue({ afterClosed: () => of(false) } as any);
    component.deleteStudent(mockStudents[0] as any);
    expect(studentServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should handle delete error', () => {
    const dialogInstance = (component as any).dialog;
    jest.spyOn(dialogInstance, 'open').mockReturnValue({ afterClosed: () => of(true) } as any);
    studentServiceSpy.delete.mockReturnValue(throwError(() => ({ error: { message: 'Erreur' } })));
    component.deleteStudent(mockStudents[0] as any);
    expect(studentServiceSpy.delete).toHaveBeenCalled();
  });
});
