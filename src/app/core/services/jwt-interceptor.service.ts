import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import {AuthService } from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
      req = this.authService.requestAddBearer(req);
      return next.handle(req);
    }
}
