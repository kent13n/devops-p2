import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jest.Mocked<UserService>;
  let router: Router;

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
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call register on invalid form', () => {
    component.onSubmit();
    expect(userServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call register and navigate on valid submission', () => {
    userServiceSpy.register.mockReturnValue(of({}));
    jest.spyOn(router, 'navigate');
    component.registerForm.setValue({ firstName: 'A', lastName: 'B', login: 'c', password: 'd' });
    component.onSubmit();
    expect(userServiceSpy.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display error on register failure', () => {
    userServiceSpy.register.mockReturnValue(throwError(() => ({ error: { message: 'Login existe déjà' } })));
    component.registerForm.setValue({ firstName: 'A', lastName: 'B', login: 'c', password: 'd' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Login existe déjà');
    expect(component.loading).toBe(false);
  });

  it('should display default error when no message in response', () => {
    userServiceSpy.register.mockReturnValue(throwError(() => ({ error: null })));
    component.registerForm.setValue({ firstName: 'A', lastName: 'B', login: 'c', password: 'd' });
    component.onSubmit();
    expect(component.errorMessage).toContain('Erreur');
  });

  it('should reset form on onReset', () => {
    component.submitted = true;
    component.errorMessage = 'err';
    component.onReset();
    expect(component.submitted).toBe(false);
    expect(component.errorMessage).toBe('');
  });
});
