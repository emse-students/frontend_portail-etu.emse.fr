import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserLight } from '../models/auth.model';
import { map } from 'rxjs/operators';
import { JsonLdService } from './json-ld.service';
import { Booking } from '../models/event.model';
import { CercleUserDTO, User, UserBookings, UserDTO, UserOperation } from '../models/user.model';
import { EventService } from './event.service';
import { arrayRemoveByValue } from './utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _user: User;
  user: Subject<User>;

  constructor(private http: HttpClient) {
    this.user = new Subject<User>();
    this._user = null;
  }

  public getAllUsers(): Observable<UserLight[]> {
    const url = `${environment.apiUrl}/users`;
    return this.http.get<UserLight[]>(url).pipe(
      map(users => JsonLdService.parseCollection<UserLight>(users).collection),
      map(users =>
        users.sort((a, b) =>
          a.promo < b.promo ? 1 : a.promo > b.promo ? -1 : a.type === 'ICM' ? -1 : 1,
        ),
      ),
    );
  }

  public put(user: UserLight): Observable<UserLight> {
    const url = `${environment.apiUrl}/users/${user.id}`;
    return this.http.put<UserLight>(url, user);
  }

  public getBalance() {
    if (this._user) {
      const url = `${environment.apiUrl}/users/${this._user.id}?properties[]=balance`;
      return this.http.get<UserDTO>(url).subscribe((user: UserDTO) => {
        this._user.balance = user.balance;
        this.getCercleInfo();
      });
    }
  }

  public getInfo() {
    if (this._user) {
      const url = `${environment.apiUrl}/users/${this._user.id}/info?properties[]=balance&properties[]=eventsBooked`;
      return this.http.get<UserDTO>(url).subscribe((user: UserDTO) => {
        this._user.balance = user.balance;
        this._user.eventsBooked = user.eventsBooked;
        this.getCercleInfo();
      });
    }
  }

  public getCercleInfo() {
    if (this._user) {
      const url = `${environment.apiUrl}/get-cercle-info`;
      return this.http
        .post<CercleUserDTO>(url, { login: this._user.login })
        .subscribe((user: CercleUserDTO) => {
          this._user.cercleBalance = user.balance;
          this._user.contributeCercle = user.contribute;
          this.refresh();
        });
    }
  }

  public getMultipleCercleInfos(logins: string[]): Observable<CercleUserDTO[]> {
    const url = `${environment.apiUrl}/get-cercle-infos`;
    return this.http.post<CercleUserDTO[]>(url, { logins });
  }

  public getBookings(): Observable<Booking[]> {
    if (this._user) {
      const url = `${environment.apiUrl}/users/${this._user.id}?properties[]=bookings`;
      return this.http.get<UserBookings>(url).pipe(
        map(user => user.bookings),
        map(bookings =>
          bookings.map(booking => {
            booking.event = EventService.parseDates(booking.event);
            return booking;
          }),
        ),
      );
    }
  }

  public setUser(userId: number, login: string) {
    if (!this._user || this._user.id !== userId) {
      this._user = {
        id: userId,
        login: login,
        balance: null,
        cercleBalance: null,
        eventsBooked: null,
        contributeCercle: false,
      };
    }
  }

  public isCercleContributor(): boolean {
    return this._user && this._user.contributeCercle;
  }

  public logout() {
    this._user = null;
  }

  public refresh() {
    this.user.next(this._user);
  }

  public updateBalance(amount: number) {
    this._user.balance += amount;
    this.refresh();
  }

  public updateCercleBalance(amount: number) {
    this._user.cercleBalance += amount;
    this.refresh();
  }

  public hasBooked(eventId: number) {
    if (this._user && this._user.eventsBooked) {
      return this._user.eventsBooked.includes(eventId);
    } else {
      return false;
    }
  }

  public book(eventId: number) {
    if (this._user && this._user.eventsBooked) {
      this._user.eventsBooked.push(eventId);
    }
  }
  public unbook(eventId: number) {
    if (this._user && this._user.eventsBooked) {
      this._user.eventsBooked = arrayRemoveByValue(this._user.eventsBooked, eventId);
    }
  }

  public getUserOperations(userId: number) {
    const url = `${environment.apiUrl}/users/${userId}/info?properties[]=balance&
    properties[]=operations&properties[]=lastname&properties[]=firstname&properties[]=promo&properties[]=type`;
    return this.http.get<UserOperation>(url).pipe(
      map((user: UserOperation) => {
        for (let i = 0; i < user.operations.length; i++) {
          user.operations[i].createdAt = new Date(user.operations[i].createdAt);
        }
        return user;
      }),
    );
  }
}
