import { Injectable } from '@angular/core';
import {AuthenticatedUser, Token} from '../models/auth.model';
import {environment} from '../../../environments/environment';
import {HttpBackend, HttpRequest, HttpResponse} from '@angular/common/http';
import {finalize, mergeMap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Injectable()
export class AuthService {
  authenticatedUser: Subject<AuthenticatedUser | null>;
  private _authenticatedUser: AuthenticatedUser | null;


  constructor(private http: HttpBackend) {
    this.authenticatedUser = new Subject<AuthenticatedUser | null>();
    const m = window.location.href.match(/(.*)[&?]ticket=([^&?]*)$/);
    if (m) {
      const [_, ourUrl, ticket] = m;
      console.log('got ticket from url ' + ticket);

      this.ticket2bearer(ticket, ourUrl).pipe(
        finalize(() => {
          // remove from url:
          history.replaceState({}, null, ourUrl);
        })
      ).subscribe(authenticatedUser => {
        this.authenticatedUser.next(authenticatedUser);
        this._authenticatedUser = authenticatedUser;
        console.log('logged in');
        console.log(authenticatedUser);
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
      });
    } else if (localStorage['authenticatedUser']) {
      console.log('logging from localStorage...');
      const retrievedObject = localStorage.getItem('authenticatedUser');
      const authenticatedUser = JSON.parse(retrievedObject);
      console.log(authenticatedUser);
      if (authenticatedUser.token.exp > Date.now() / 1000) {
        console.log('logged in from localStorage');
        this.authenticatedUser.next(authenticatedUser);
        this._authenticatedUser = authenticatedUser;
      } else {
        this.authenticatedUser.next(null);
        this._authenticatedUser = null;
      }
    } else {
      this.authenticatedUser.next(null);
      this._authenticatedUser = null;
    }
  }


  ticket2bearer(ticket, service) {
    const url = `${environment.api_login_url}?service=${encodeURIComponent(service)}&ticket=${encodeURIComponent(ticket)}`;
    return this.http.handle(new HttpRequest('GET', url)).pipe(
      mergeMap(resp => (
        resp instanceof HttpResponse && resp.body && [resp.body['authenticatedUser']] || []
      ))
    );
  }

  login() {
    window.location.href = `${environment.cas_login_url}?service=${encodeURIComponent(window.location.href)}`;
  }

  logout() {
    this._authenticatedUser = null;
    this.authenticatedUser.next(null);
    if (localStorage['authenticatedUser']) {
      localStorage.removeItem('authenticatedUser');
    }
  }

  requestAddBearer(req) {
    if (this._authenticatedUser) {
      return req.clone({ setHeaders: { 'Authorization': `Bearer ${this._authenticatedUser.token.bearer}` }});
    } else {
      return req;
    }
  }

  refresh() {
    this.authenticatedUser.next(this._authenticatedUser);
  }
}
