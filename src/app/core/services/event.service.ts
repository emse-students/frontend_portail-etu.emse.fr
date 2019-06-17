import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JsonLdService } from './json-ld.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import {
  Event,
  NewBooking,
  Booking,
  PutBooking,
  PutBookingLight,
  EventBooking,
} from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  static parseDates(event: Event): Event {
    if (event.date) {
      event.date = new Date(event.date);
    }
    if (event.closingDate) {
      event.closingDate = new Date(event.closingDate);
    }
    if (event.shotgunStartingDate) {
      event.shotgunStartingDate = new Date(event.shotgunStartingDate);
    }
    return event;
  }

  static parseBookingDates(booking: EventBooking): EventBooking {
    if (booking.createdAt) {
      booking.createdAt = new Date(booking.createdAt);
    }
    if (booking.event) {
      booking.event = EventService.parseDates(booking.event);
    }
    return booking;
  }

  public create(event: Event): Observable<Event> {
    const url = `${environment.api_url}/events`;
    return this.http.post<Event>(url, event).pipe(map(EventService.parseDates));
  }

  public getCalendarEvents(date: Date = null): Observable<Event[]> {
    const url = `${environment.api_url}/events?time=${
      date ? date.getTime() / 1000 : 'now'
    }&status=validated|inactive`;
    return this.http
      .get<Event[]>(url)
      .pipe(
        map(events =>
          JsonLdService.parseCollection<Event>(events).collection.map(EventService.parseDates),
        ),
      );
  }

  public get(eventId: number): Observable<Event> {
    const url = `${environment.api_url}/events/${eventId}`;
    return this.http.get<Event>(url).pipe(map(EventService.parseDates));
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.api_url}/events/${id}`;
    return this.http.delete(url);
  }

  public put(event: Event): Observable<Event> {
    const url = `${environment.api_url}/events/${event.id}`;
    return this.http.put<Event>(url, event).pipe(map(EventService.parseDates));
  }

  public book(booking: NewBooking): Observable<EventBooking> {
    const url = `${environment.api_url}/bookings`;
    return this.http
      .post<EventBooking>(url, booking)
      .pipe(map(b => EventService.parseBookingDates(b)));
  }

  public getBooking(bookingId: number): Observable<Booking> {
    const url = `${environment.api_url}/bookings/${bookingId}`;
    return this.http.get<Booking>(url).pipe(
      map((booking: Booking) => {
        booking.event = EventService.parseDates(booking.event);
        return booking;
      }),
    );
  }

  public putBook(putBooking: PutBooking | PutBookingLight): Observable<Booking> {
    const url = `${environment.api_url}/bookings/${putBooking.id}`;
    return this.http.put<Booking>(url, putBooking);
  }

  public deleteBooking(bookingiId: number): Observable<Booking> {
    const url = `${environment.api_url}/bookings/${bookingiId}`;
    return this.http.delete<Booking>(url);
  }

  public getBookings(eventId: number): Observable<Event> {
    const url = `${environment.api_url}/events/${eventId}/bookings`;
    return this.http.get<Event>(url).pipe(
      map(event => {
        event.bookings = event.bookings.map(EventService.parseBookingDates);
        return event;
      }),
    );
  }
}
