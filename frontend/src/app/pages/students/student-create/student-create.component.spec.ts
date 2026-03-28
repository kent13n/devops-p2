import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StudentCreateComponent } from './student-create.component';
import { StudentService } from '../../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentCreateComponent', () => {
  let component: StudentCreateComponent;
  let fixture: ComponentFixture<StudentCreateComponent>;
  let studentServiceSpy: jest.Mocked<StudentService>;

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit should call studentService.create', () => {
    const request = { firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com' };
    component.onSubmit(request);
    expect(studentServiceSpy.create).toHaveBeenCalledWith(request);
  });
});
