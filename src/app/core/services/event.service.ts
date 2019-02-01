import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonLdService} from './json-ld.service';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {NewEvent, Event} from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor (private http: HttpClient, private jsonLdService: JsonLdService) {}

  public create(event: NewEvent): Observable<Event> {
    const url = `${environment.api_url}/events`;
    console.log('sending');
    return this.http.post<Event>(url, event);
  }

  public gets(): Observable<Event[]> {
    const url = `${environment.api_url}/events`;
    return this.http.get<Event[]>(url).pipe(
      map((event) => this.jsonLdService.parseCollection<Event>(event).collection)
    );
  }

  public get(eventId: number): Observable<Event> {
    const url = `${environment.api_url}/events/${eventId}`;
    return this.http.get<Event>(url);
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.api_url}/events/${id}`;
    return this.http.delete(url);
  }

  public put (event: Event): Observable<Event> {
    const url = `${environment.api_url}/events/${event.id}`;
    return this.http.put<Event>(url, event);
  }
}
