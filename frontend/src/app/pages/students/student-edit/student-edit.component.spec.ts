import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StudentEditComponent } from './student-edit.component';
import { StudentService } from '../../../core/service/student.service';
import { of, throwError } from 'rxjs';

const mockStudent = { id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com', created_at: '', updated_at: '' };

describe('StudentEditComponent', () => {
  let component: StudentEditComponent;
  let fixture: ComponentFixture<StudentEditComponent>;
  let studentServiceSpy: jest.Mocked<StudentService>;
  let router: Router;

  function createComponent(paramId: string) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { paramMap: { get: () => paramId } } }
    });
    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    studentServiceSpy = {
      findById: jest.fn().mockReturnValue(of(mockStudent)),
      update: jest.fn().mockReturnValue(of({}))
    } as any;

    await TestBed.configureTestingModule({
      imports: [StudentEditComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: StudentService, useValue: studentServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();
  });

  it('should create and load student', () => {
    createComponent('1');
    expect(component).toBeTruthy();
    expect(studentServiceSpy.findById).toHaveBeenCalledWith(1);
    expect(component.student?.firstName).toBe('Marie');
  });

  it('should set error for invalid id', () => {
    createComponent('abc');
    expect(component.errorMessage).toContain('invalide');
    expect(component.loadingStudent).toBe(false);
  });

  it('should set error when findById fails', () => {
    studentServiceSpy.findById.mockReturnValue(throwError(() => ({ error: { message: 'Non trouvé' } })));
    createComponent('999');
    expect(component.errorMessage).toBe('Non trouvé');
  });

  it('should use default error when findById fails without message', () => {
    studentServiceSpy.findById.mockReturnValue(throwError(() => ({ error: null })));
    createComponent('999');
    expect(component.errorMessage).toContain('non trouvé');
  });

  it('onSubmit should call update and navigate', () => {
    createComponent('1');
    jest.spyOn(router, 'navigate');
    component.onSubmit({ firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com' });
    expect(studentServiceSpy.update).toHaveBeenCalledWith(1, { firstName: 'Jean', lastName: 'Dupont', email: 'jean@mail.com' });
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });

  it('onSubmit should set error on update failure', () => {
    createComponent('1');
    studentServiceSpy.update.mockReturnValue(throwError(() => ({ error: { message: 'Email pris' } })));
    component.onSubmit({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    expect(component.errorMessage).toBe('Email pris');
    expect(component.loading).toBe(false);
  });

  it('onSubmit should use default error when no message', () => {
    createComponent('1');
    studentServiceSpy.update.mockReturnValue(throwError(() => ({ error: null })));
    component.onSubmit({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    expect(component.errorMessage).toContain('Erreur');
  });

  it('onCancel should navigate to /students', () => {
    createComponent('1');
    jest.spyOn(router, 'navigate');
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/students']);
  });
});
