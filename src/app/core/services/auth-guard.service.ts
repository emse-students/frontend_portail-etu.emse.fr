import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {of} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isAuthenticated()) {
      return of(true);
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isAdmin()) {
      return of(true);
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
