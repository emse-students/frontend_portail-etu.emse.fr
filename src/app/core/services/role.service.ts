import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {NewRole, Right, Role} from '../models/role.model';
import {map} from 'rxjs/operators';
import {JsonLdService} from './json-ld.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor (private http: HttpClient, private jsonLdService: JsonLdService) {}

  public create(role: NewRole): Observable<Role> {
    const url = `${environment.api_url}/roles`;
    return this.http.post<Role>(url, role);
  }

  public gets(): Observable<Role[]> {
    const url = `${environment.api_url}/roles`;
    return this.http.get<Role[]>(url).pipe(map((roles) => this.jsonLdService.parseCollection<Role>(roles).collection));
  }

  public getRights(): Observable<Right[]> {
    const url = `${environment.api_url}/user_rights`;
    return this.http.get<Right[]>(url);
  }

  public get(roleId: number): Observable<Role> {
    const url = `${environment.api_url}/roles/${roleId}`;
    return this.http.get<Role>(url);
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.api_url}/roles/${id}`;
    return this.http.delete(url);
  }

  public put (role: Role): Observable<Role> {
    const url = `${environment.api_url}/roles/${role.id}`;
    return this.http.put<Role>(url, role);
  }
}
