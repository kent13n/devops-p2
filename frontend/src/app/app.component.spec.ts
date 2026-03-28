import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './core/service/auth.service';

describe('AppComponent', () => {
  let authServiceSpy: jest.Mocked<AuthService>;

  beforeEach(async () => {
    authServiceSpy = {
      isLoggedIn: jest.fn(),
      logout: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('isLoggedIn should delegate to AuthService', () => {
    authServiceSpy.isLoggedIn.mockReturnValue(true);
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance.isLoggedIn).toBe(true);
  });

  it('logout should call AuthService.logout()', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
