import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    routerSpy = { navigate: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('saveToken should store token in localStorage', () => {
    service.saveToken('test-token');
    expect(localStorage.getItem('jwt_token')).toBe('test-token');
  });

  it('getToken should return the saved token', () => {
    localStorage.setItem('jwt_token', 'my-token');
    expect(service.getToken()).toBe('my-token');
  });

  it('removeToken should delete the token from localStorage', () => {
    localStorage.setItem('jwt_token', 'my-token');
    service.removeToken();
    expect(localStorage.getItem('jwt_token')).toBeNull();
  });

  it('isLoggedIn should return true when token exists', () => {
    service.saveToken('token');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn should return false when no token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('logout should remove token and navigate to /login', () => {
    service.saveToken('token');
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
