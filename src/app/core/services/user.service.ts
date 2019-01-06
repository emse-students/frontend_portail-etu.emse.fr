import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Role} from '../models/role.model';
import {environment} from '../../../environments/environment';
import {UserLight} from '../models/auth.model';
import {map} from 'rxjs/operators';
import {JsonLdService} from './json-ld.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private jsonLdService: JsonLdService) { }

  public getAllUsers(): Observable<UserLight[]> {
    const url = `${environment.api_url}/users`;
    return this.http.get<UserLight[]>(url).pipe(map((users) => this.jsonLdService.parseCollection<UserLight>(users).collection));
  }
}
