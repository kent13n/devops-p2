import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ActivatedRoute } from '@angular/router';
import { StudentEditComponent } from './student-edit.component';
import { StudentService } from '../../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentEditComponent', () => {
  let component: StudentEditComponent;
  let fixture: ComponentFixture<StudentEditComponent>;
  let studentServiceSpy: jest.Mocked<StudentService>;

  beforeEach(async () => {
    studentServiceSpy = {
      findById: jest.fn().mockReturnValue(of({
        id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com', created_at: '', updated_at: ''
      })),
      update: jest.fn().mockReturnValue(of({}))
    } as any;

    await TestBed.configureTestingModule({
      imports: [StudentEditComponent],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        { provide: StudentService, useValue: studentServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student on init', () => {
    expect(studentServiceSpy.findById).toHaveBeenCalledWith(1);
    expect(component.student?.firstName).toBe('Marie');
  });
});
