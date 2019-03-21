import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ExcelAnswer} from '../models/excel.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor (private http: HttpClient) {}

  public generateBookingExcel(eventId: number): Observable<ExcelAnswer> {
    const url = `${environment.api_url}/excel/generate/${eventId}`;
    return this.http.get<ExcelAnswer>(url);
  }
}
