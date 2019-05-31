import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NewOperation, Operation } from '../models/operation.model';
import { map, tap } from 'rxjs/operators';
import { JsonLdService } from './json-ld.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  constructor(
    private http: HttpClient,
    private jsonLdService: JsonLdService,
    private userService: UserService,
  ) {}

  public create(operation: NewOperation): Observable<Operation> {
    const url = `${environment.api_url}/operations`;
    return this.http.post<Operation>(url, operation).pipe(
      tap(() => {
        this.userService.updateBalance(operation.amount);
      }),
    );
  }

  public gets(): Observable<Operation[]> {
    const url = `${environment.api_url}/operations`;
    return this.http
      .get<Operation[]>(url)
      .pipe(map(operations => JsonLdService.parseCollection<Operation>(operations).collection));
  }

  public get(operationId: number): Observable<Operation> {
    const url = `${environment.api_url}/operations/${operationId}`;
    return this.http.get<Operation>(url);
  }

  public delete(operation: Operation): Observable<any> {
    const url = `${environment.api_url}/operations/${operation.id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        this.userService.updateBalance(-operation.amount);
      }),
    );
  }
}
