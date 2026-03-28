import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../core/service/student.service';
import { of } from 'rxjs';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentServiceSpy: jest.Mocked<StudentService>;

  beforeEach(async () => {
    studentServiceSpy = {
      findAll: jest.fn().mockReturnValue(of([
        { id: 1, firstName: 'Marie', lastName: 'Martin', email: 'marie@mail.com', created_at: '', updated_at: '' }
      ])),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    expect(studentServiceSpy.findAll).toHaveBeenCalled();
    expect(component.dataSource.data).toHaveLength(1);
  });

  it('should display add student button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const btn = compiled.querySelector('a[routerLink="/students/create"]');
    expect(btn).toBeTruthy();
  });
});
