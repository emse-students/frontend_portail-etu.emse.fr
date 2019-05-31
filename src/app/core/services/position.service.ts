import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewPosition, Position } from '../models/position.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) {}

  public create(position: NewPosition): Observable<Position> {
    const url = `${environment.api_url}/positions`;
    return this.http.post<Position>(url, position);
  }

  public delete(positionId: number): Observable<Position> {
    const url = `${environment.api_url}/positions/${positionId}`;
    return this.http.delete<Position>(url);
  }
}
