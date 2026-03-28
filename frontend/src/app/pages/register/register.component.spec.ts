import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jest.Mocked<UserService>;

  beforeEach(async () => {
    userServiceSpy = { register: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call register on invalid form submission', () => {
    component.onSubmit();
    expect(userServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call userService.register on valid form submission', () => {
    userServiceSpy.register.mockReturnValue(of({}));
    component.registerForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      login: 'john',
      password: 'pass'
    });
    component.onSubmit();
    expect(userServiceSpy.register).toHaveBeenCalled();
  });
});
