import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './login.component';
import { UserService } from '../../core/service/user.service';
import { AuthService } from '../../core/service/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userServiceSpy: jest.Mocked<UserService>;
  let authServiceSpy: jest.Mocked<AuthService>;

  beforeEach(async () => {
    userServiceSpy = { login: jest.fn() } as any;
    authServiceSpy = { saveToken: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login and password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const inputs = compiled.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should not call login on invalid form submission', () => {
    component.onSubmit();
    expect(userServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call userService.login on valid form submission', () => {
    userServiceSpy.login.mockReturnValue(of('jwt-token'));
    component.loginForm.setValue({ login: 'user', password: 'pass' });
    component.onSubmit();
    expect(userServiceSpy.login).toHaveBeenCalled();
  });
});
