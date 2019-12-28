import { Injectable } from '@angular/core';
import { HttpBackend, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, finalize, mergeMap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticatedUser } from '../models/auth.model';
import { InfoService } from './info.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpBackend,
    private infoService: InfoService,
    private userService: UserService,
  ) {
    this.authenticatedUser = new Subject<AuthenticatedUser | null>();
    this._authenticatedUser = null;
    const m = window.location.href.match(/(.*)[&?]ticket=([^&?]*)$/);
    if (m) {
      const [, ourUrl, ticket] = m;
      console.log(`got ticket from url ${ticket}`);
      this._pending = true;
      this.ticket2bearer(ticket, ourUrl)
        .pipe(
          finalize(() => {
            // remove from url:
            history.replaceState({}, null, ourUrl);
            history.pushState({}, null, ourUrl);
          }),
        )
        .subscribe((authenticatedUser: AuthenticatedUser) => {
          this._authenticatedUser = authenticatedUser;
          this.userService.setUser(authenticatedUser.id, authenticatedUser.login);
          this.authenticatedUser.next(authenticatedUser);
          this._pending = false;
          console.log('logged in');
          localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
        });
    } else if (localStorage.authenticatedUser) {
      console.log('logging from localStorage...');
      const retrievedObject = localStorage.getItem('authenticatedUser');
      const authenticatedUser = JSON.parse(retrievedObject);
      // console.log(authenticatedUser);
      if (authenticatedUser.token.exp > Date.now() / 1000) {
        console.log('logged in from localStorage');
        this.authenticatedUser.next(authenticatedUser);
        this._authenticatedUser = authenticatedUser;
        this.userService.setUser(authenticatedUser.id, authenticatedUser.login);
      } else {
        console.log('token has expired');
        this.authenticatedUser.next(null);
      }
    } else {
      this.authenticatedUser.next(null);
    }
  }
  authenticatedUser: Subject<AuthenticatedUser | null>;
  private _authenticatedUser: AuthenticatedUser | null;
  private _pending = false;

  static login() {
    window.location.href = `${environment.casLoginUrl}?service=${encodeURIComponent(
      window.location.href,
    )}`;
  }

  ticket2bearer(ticket, service) {
    const url = `${environment.apiLoginUrl}?service=${encodeURIComponent(
      service,
    )}&ticket=${encodeURIComponent(ticket)}`;
    return this.http.handle(new HttpRequest('GET', url)).pipe(
      mergeMap(
        resp => (resp instanceof HttpResponse && resp.body && [resp.body.authenticatedUser]) || [],
      ),
      catchError(err => {
        if (err.status === 401 && err.error.message) {
          this.infoService.pushError(err.error.message, err.status);
        } else {
          this.infoService.pushError('Une erreur est survenue', err.status);
        }
        return throwError(err);
      }),
    );
  }

  logout() {
    this._authenticatedUser = null;
    if (localStorage.authenticatedUser) {
      localStorage.removeItem('authenticatedUser');
    }
    this.userService.logout();
    this.authenticatedUser.next(null);
  }

  requestAddBearer(req) {
    if (this._authenticatedUser) {
      return req.clone({
        setHeaders: { Authorization: `Bearer ${this._authenticatedUser.token.bearer}` },
      });
    }
    return req;
  }

  refresh() {
    if (!this._pending) {
      this.authenticatedUser.next(this._authenticatedUser);
    }
  }

  hasAssoRight(rightId: number, assoId = 1): boolean {
    if (this._authenticatedUser) {
      const searchedRole = `ROLE_R${rightId}_A${assoId}`;
      return this._authenticatedUser.roles.includes(searchedRole);
    }
    return false;
  }

  hasAsso(): boolean {
    if (this._authenticatedUser) {
      for (let i = 0; i < this._authenticatedUser.roles.length; i++) {
        if (this._authenticatedUser.roles[i] === 'ROLE_R0_A1') {
          return true;
        }
        if (this._authenticatedUser.roles[i].match(/ROLE_R3/)) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  getAssoIdRightfullyEventEditable(): number[] {
    if (this._authenticatedUser) {
      const assoIds = [];
      for (let i = 0; i < this._authenticatedUser.roles.length; i++) {
        if (this._authenticatedUser.roles[i] === 'ROLE_R0_A1') {
          return [0];
        }
        if (this._authenticatedUser.roles[i].match(/ROLE_R3/)) {
          assoIds.push(parseInt(this._authenticatedUser.roles[i].match(/ROLE_R3_A(\d+)/)[1], 10));
        }
      }
      return assoIds;
    }
    return [];
  }

  isAdmin(): boolean {
    return !!this._authenticatedUser && this._authenticatedUser.roles.includes('ROLE_R0_A1');
  }

  isBDEContributor(): boolean {
    return !!this._authenticatedUser && this._authenticatedUser.contributeBDE;
  }

  isCercleContributor(): boolean {
    return this.userService.isCercleContributor();
  }

  isAuthenticated(): boolean {
    return this._authenticatedUser !== null;
  }
}
