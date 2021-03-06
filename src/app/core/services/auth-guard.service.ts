// eslint-disable-next-line max-classes-per-file
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line consistent-return
  canActivate() {
    if (this.authService.isAuthenticated()) {
      return of(true);
    }
    this.router.navigateByUrl('/home');
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  // eslint-disable-next-line consistent-return
  canActivate() {
    if (this.authService.isAdmin()) {
      return of(true);
    }
    this.router.navigateByUrl('/home');
  }
}
