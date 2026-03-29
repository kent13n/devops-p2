import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
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
  let router: Router;

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
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display login and password fields', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThanOrEqual(2);
  });

  it('should not call login on invalid form submission', () => {
    component.onSubmit();
    expect(userServiceSpy.login).not.toHaveBeenCalled();
    expect(component.submitted).toBe(true);
  });

  it('should call userService.login and navigate on valid submission', () => {
    userServiceSpy.login.mockReturnValue(of('jwt-token'));
    jest.spyOn(router, 'navigate');
    component.loginForm.setValue({ login: 'user', password: 'pass' });
    component.onSubmit();
    expect(userServiceSpy.login).toHaveBeenCalled();
    expect(authServiceSpy.saveToken).toHaveBeenCalledWith('jwt-token');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should display error message on login failure', () => {
    userServiceSpy.login.mockReturnValue(throwError(() => ({ error: { message: 'Identifiants invalides' } })));
    component.loginForm.setValue({ login: 'user', password: 'bad' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Identifiants invalides');
    expect(component.loading).toBe(false);
  });

  it('should display default error when no message in response', () => {
    userServiceSpy.login.mockReturnValue(throwError(() => ({ error: null })));
    component.loginForm.setValue({ login: 'user', password: 'bad' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Erreur lors de la connexion');
  });

  it('should reset form and clear errors on onReset', () => {
    component.submitted = true;
    component.errorMessage = 'erreur';
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.errorMessage).toBe('');
  });
});
