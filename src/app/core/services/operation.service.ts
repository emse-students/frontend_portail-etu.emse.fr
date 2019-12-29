import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { NewOperation, Operation } from '../models/operation.model';
import { JsonLdService } from './json-ld.service';
import { UserService } from './user.service';
import { JsonLdCollection } from '../models/json-ld.model';

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
    const url = `${environment.apiUrl}/operations`;
    return this.http.post<Operation>(url, operation).pipe(
      tap(() => {
        this.userService.updateBalance(operation.amount);
      }),
    );
  }

  public gets(
    page = 1,
    createdAtSort = 'desc',
    paymentMeansFilter: number[] = [],
    reasonFilter: string = null,
    globalFilter: string = null,
  ): Observable<JsonLdCollection<Operation>> {
    const paymentMeansRequest = paymentMeansFilter.length
      ? `&paymentMeans=${paymentMeansFilter.join(',')}`
      : '';
    const reasonRequest = reasonFilter ? `&reason=${reasonFilter}` : '';
    const globalSearchRequest = globalFilter ? `&search=${globalFilter}` : '';
    const url = `${environment.apiUrl}/operations?page=${page}&order[createdAt]=${createdAtSort}${paymentMeansRequest}${reasonRequest}${globalSearchRequest}`;
    return this.http
      .get<Operation[]>(url)
      .pipe(map(operations => JsonLdService.parseCollection<Operation>(operations)));
  }

  public get(operationId: number): Observable<Operation> {
    const url = `${environment.apiUrl}/operations/${operationId}`;
    return this.http.get<Operation>(url);
  }

  public delete(operation: Operation): Observable<any> {
    const url = `${environment.apiUrl}/operations/${operation.id}`;
    return this.http.delete(url).pipe(
      tap(() => {
        this.userService.updateBalance(-operation.amount);
      }),
    );
  }
}
