import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StudentCreateComponent } from './student-create.component';
import { StudentService } from '../../../core/service/student.service';
import { of, throwError } from 'rxjs';

describe('StudentCreateComponent', () => {
  let component: StudentCreateComponent;
  let fixture: ComponentFixture<StudentCreateComponent>;
  let studentServiceSpy: jest.Mocked<StudentService>;
  let router: Router;

  beforeEach(async () => {
    studentServiceSpy = { create: jest.fn().mockReturnValue(of({})) } as any;

    await TestBed.configureTestingModule({
      imports: [StudentCreateComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: StudentService, useValue: studentServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCreateComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit should call studentService.create and navigate', () => {
    jest.spyOn(router, 'navigate');
    const request = { firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com' };
    component.onSubmit(request);
    expect(studentServiceSpy.create).toHaveBeenCalledWith(request);
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('onSubmit should set errorMessage on failure', () => {
    studentServiceSpy.create.mockReturnValue(throwError(() => ({ error: { message: 'Email existe' } })));
    component.onSubmit({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    expect(component.errorMessage).toBe('Email existe');
    expect(component.loading).toBe(false);
  });

  it('onSubmit should use default error when no message', () => {
    studentServiceSpy.create.mockReturnValue(throwError(() => ({ error: null })));
    component.onSubmit({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    expect(component.errorMessage).toContain('Erreur');
  });

  it('onCancel should navigate to /students', () => {
    jest.spyOn(router, 'navigate');
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
