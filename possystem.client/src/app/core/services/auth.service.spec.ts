import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthUser } from '../models/user.model';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should authenticate through LoginController and retain the UserAccount data', () => {
    let authenticatedUser: AuthUser | undefined;

    service.login('admin', 'password').subscribe(user => authenticatedUser = user);

    const request = http.expectOne('/Login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ userName: 'admin', password: 'password' });

    request.flush({
      accountId: 1,
      userName: 'admin',
      userRoleId: 10,
      userRole: 'Admin',
      authorizedFeatureIds: [1, 2]
    });

    expect(authenticatedUser!).toEqual(jasmine.objectContaining({
      accountId: 1,
      userName: 'admin',
      userRoleId: 10,
      userRole: 'Admin',
      authorizedFeatureIds: [1, 2],
      username: 'admin',
      role: 'Admin'
    }));
  });
});
