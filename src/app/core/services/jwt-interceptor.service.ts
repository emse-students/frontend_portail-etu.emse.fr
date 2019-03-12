import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import {AuthService } from './auth.service';
import {Observable} from 'rxjs';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
      req = this.authService.requestAddBearer(req);
      // console.log(req);
      if (!(req.body instanceof FormData)) {
        req = req.clone({ setHeaders: { 'Content-Type': 'application/ld+json' }});
      }
      return next.handle(req);
    }
}
