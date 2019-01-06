import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {InfoService} from './info.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router, private infoService: InfoService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
          catchError(err => {
            console.log(err);
            if (err.status === 401 && err.error.message && err.error.message.status !== '401 Bad Credential') {
              // auto logout if 401 response returned from api
              this.authService.logout();
              this.infoService.pushError('Votre sessions n\'est plus valide, veuillez vous reconnecter', err.status) ;
              return throwError(err);
            } else if (err.status === 403) {
              this.authService.logout();
              this.infoService.pushError(
                'Action non autorisée. Vos droits ont probablement été mis à jour, reconnectez vous.',
                err.status
              ) ;
              return throwError(err);
            } else {
              let error;
              if ( err.error['hydra:description'] ) {
                error = err.error['hydra:description'];
              } else if ( err.error.violations ) {
                error = err.error.violations[0].message || err.statusText;
              } else if (err.error.message && err.error.message.message) {
                error = err.error.message.message;
              } else if ( err.status === 500 ) {
                error = 'Une erreur est survenue';
              } else {
                error = err.statusText;
              }
              this.infoService.pushError(error, err.status);
              return throwError(error);
            }
        }));
    }
}
