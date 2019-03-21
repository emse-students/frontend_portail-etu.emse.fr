import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthenticatedUser, UserLight} from '../models/auth.model';
import {map} from 'rxjs/operators';
import {JsonLdService} from './json-ld.service';
import {Booking, Event} from '../models/event.model';
import {User, UserBookings, UserOperation} from '../models/user.model';
import {EventService} from './event.service';
import {arrayRemoveByValue} from './utils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: User;
  user: Subject<User>;

  constructor(
    private http: HttpClient,
    private jsonLdService: JsonLdService
  ) {
    this.user = new Subject<User>();
    this._user = null;
  }

  public getAllUsers(): Observable<UserLight[]> {
    const url = `${environment.api_url}/users`;
    return this.http.get<UserLight[]>(url).pipe(
      map((users) => this.jsonLdService.parseCollection<UserLight>(users).collection),
      map((users) => users.sort((a, b) => (a.promo < b.promo) ? 1 : -1))
    );
  }

  public getBalance() {
    if (this._user) {
      const url = `${environment.api_url}/users/${this._user.id}?properties[]=balance`;
      return this.http.get<User>(url).subscribe((user: User) => {
        this._user.balance = user.balance;
        this.refresh();
      });
    }
  }

  public getInfo() {
    if (this._user) {
      const url = `${environment.api_url}/users/${this._user.id}/info?properties[]=balance&properties[]=eventsBooked`;
      return this.http.get<User>(url).subscribe(
        (user: User) => {this._user.balance = user.balance; this._user.eventsBooked = user.eventsBooked; this.refresh(); }
      );
    }
  }

  public getBookings(): Observable<Booking[]> {
    if (this._user) {
      const url = `${environment.api_url}/users/${this._user.id}?properties[]=bookings`;
      return this.http.get<UserBookings>(url).pipe(
        map((user) => user.bookings),
        map((bookings) => bookings.map((booking) => {booking.event = EventService.parseDates(booking.event); return booking; }))
      );
    }
  }

  public setId(userId: number) {
    if (!this._user || this._user.id !== userId) {
      this._user = {id: userId, balance: null, eventsBooked: null };
    }
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
    const url = `${environment.api_url}/users/${userId}/info?properties[]=balance&
    properties[]=operations&properties[]=lastname&properties[]=firstname&properties[]=promo`;
    return this.http.get<UserOperation>(url).pipe(
      map( (user: UserOperation) => {
        for (let i = 0; i < user.operations.length; i++) {
          user.operations[i].createdAt = new Date(user.operations[i].createdAt);
        }
        return user;
      })
    );
  }
}
