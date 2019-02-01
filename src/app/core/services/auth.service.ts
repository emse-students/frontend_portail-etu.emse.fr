import { Injectable } from '@angular/core';
import {AuthenticatedUser, Token} from '../models/auth.model';
import {environment} from '../../../environments/environment';
import {HttpBackend, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, finalize, mergeMap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {InfoService} from './info.service';

@Injectable()
export class AuthService {
  authenticatedUser: Subject<AuthenticatedUser | null>;
  private _authenticatedUser: AuthenticatedUser | null;


  constructor(private http: HttpBackend, private infoService: InfoService) {
    this.authenticatedUser = new Subject<AuthenticatedUser | null>();
    this._authenticatedUser = null;
    const m = window.location.href.match(/(.*)[&?]ticket=([^&?]*)$/);
    if (m) {
      const [_, ourUrl, ticket] = m;
      console.log('got ticket from url ' + ticket);
      this.ticket2bearer(ticket, ourUrl).pipe(
        finalize(() => {
          // remove from url:
          history.replaceState({}, null, ourUrl);
          history.pushState({}, null, ourUrl);
        })
      ).subscribe(authenticatedUser => {
        this.authenticatedUser.next(authenticatedUser);
        this._authenticatedUser = authenticatedUser;
        console.log('logged in');
        // console.log(authenticatedUser);
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
      });
    } else if (localStorage['authenticatedUser']) {
      console.log('logging from localStorage...');
      const retrievedObject = localStorage.getItem('authenticatedUser');
      const authenticatedUser = JSON.parse(retrievedObject);
      // console.log(authenticatedUser);
      if (authenticatedUser.token.exp > Date.now() / 1000) {
        console.log('logged in from localStorage');
        this.authenticatedUser.next(authenticatedUser);
        this._authenticatedUser = authenticatedUser;
      } else {
        console.log('token has expired');
        this.authenticatedUser.next(null);
      }
    } else {
      this.authenticatedUser.next(null);
    }
  }


  ticket2bearer(ticket, service) {
    const url = `${environment.api_login_url}?service=${encodeURIComponent(service)}&ticket=${encodeURIComponent(ticket)}`;
    return this.http.handle(new HttpRequest('GET', url)).pipe(
      mergeMap(resp => (
        resp instanceof HttpResponse && resp.body && [resp.body['authenticatedUser']] || []
      )),
      catchError(err => {
        if (err.status === 401 && err.error.message) {
          this.infoService.pushError(err.error.message, err.status) ;
        } else {
          this.infoService.pushError('Une erreur est survenue', err.status);
        }
        return throwError(err);
      })
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

  isAuthenticated(rightId: number, assoId = 1): boolean {
    if (this._authenticatedUser) {
      const searchedRole = 'ROLE_R' + rightId + '_A' + assoId;
      return this._authenticatedUser.roles.includes(searchedRole);
    } else {
      return false;
    }
  }

  getAssoIdRightfullyEventEditable(): number[] {
    if (this._authenticatedUser) {
      const assoIds = [];
      for (let i = 0; i < this._authenticatedUser.roles.length; i++) {
        if (this._authenticatedUser.roles[i] === 'ROLE_R8_A1') {
          return [0];
        } else if (this._authenticatedUser.roles[i].match(/ROLE_R3/)) {
          assoIds.push(parseInt(this._authenticatedUser.roles[i].match(/ROLE_R3_A(\d+)/)[1], 10));
        }
      }
      return assoIds;
    } else {
      return [];
    }
  }

  isAdmin(): boolean {
    return this._authenticatedUser && this._authenticatedUser.roles.includes('ROLE_R8_A1');
  }
}
