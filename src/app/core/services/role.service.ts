import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NewRole, Right, Role } from '../models/role.model';
import { JsonLdService } from './json-ld.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient, private jsonLdService: JsonLdService) {}

  public create(role: NewRole): Observable<Role> {
    const url = `${environment.apiUrl}/roles`;
    return this.http.post<Role>(url, role);
  }

  public gets(): Observable<Role[]> {
    const url = `${environment.apiUrl}/roles`;
    return this.http
      .get<Role[]>(url)
      .pipe(map(roles => JsonLdService.parseCollection<Role>(roles).collection));
  }

  public getRights(): Observable<Right[]> {
    const url = `${environment.apiUrl}/user_rights`;
    return this.http.get<Right[]>(url);
  }

  public get(roleId: number): Observable<Role> {
    const url = `${environment.apiUrl}/roles/${roleId}`;
    return this.http.get<Role>(url);
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.apiUrl}/roles/${id}`;
    return this.http.delete(url);
  }

  public put(role: Role): Observable<Role> {
    const url = `${environment.apiUrl}/roles/${role.id}`;
    return this.http.put<Role>(url, role);
  }
}
