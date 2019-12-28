import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JsonLdService } from './json-ld.service';
import { NewPaymentMeans, PaymentMeans } from '../models/payment-means.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentMeansService {
  constructor(private http: HttpClient, private jsonLdService: JsonLdService) {}

  public create(paymentMeans: NewPaymentMeans): Observable<PaymentMeans> {
    const url = `${environment.apiUrl}/payment_means`;
    return this.http.post<PaymentMeans>(url, paymentMeans);
  }

  public gets(): Observable<PaymentMeans[]> {
    const url = `${environment.apiUrl}/payment_means`;
    return this.http
      .get<PaymentMeans[]>(url)
      .pipe(
        map(paymentMeans => JsonLdService.parseCollection<PaymentMeans>(paymentMeans).collection),
      );
  }

  public get(paymentMeansId: number): Observable<PaymentMeans> {
    const url = `${environment.apiUrl}/payment_means/${paymentMeansId}`;
    return this.http.get<PaymentMeans>(url);
  }

  public delete(id: number): Observable<any> {
    const url = `${environment.apiUrl}/payment_means/${id}`;
    return this.http.delete(url);
  }

  public put(paymentMeans: PaymentMeans): Observable<PaymentMeans> {
    const url = `${environment.apiUrl}/payment_means/${paymentMeans.id}`;
    return this.http.put<PaymentMeans>(url, paymentMeans);
  }
}
