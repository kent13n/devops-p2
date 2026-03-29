import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StudentFormComponent } from './student-form.component';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFormComponent],
      providers: [provideAnimationsAsync()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in create mode when no student input', () => {
    expect(component.isEditMode).toBe(false);
  });

  it('should not emit formSubmit on invalid form', () => {
    jest.spyOn(component.formSubmit, 'emit');
    component.onSubmit();
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should emit formSubmit on valid form', () => {
    jest.spyOn(component.formSubmit, 'emit');
    component.studentForm.setValue({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalledWith({ firstName: 'A', lastName: 'B', email: 'a@b.com' });
  });

  it('should emit formCancel on cancel', () => {
    jest.spyOn(component.formCancel, 'emit');
    component.onCancel();
    expect(component.formCancel.emit).toHaveBeenCalled();
  });
});
