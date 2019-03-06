import {Component, OnInit} from '@angular/core';
import {PaymentMeans} from '../../core/models/payment-means.model';
import {PaymentMeansService} from '../../core/services/payment-means.service';
import {InfoService} from '../../core/services/info.service';
import {JsonLdService} from '../../core/services/json-ld.service';
import {arrayRemoveById} from '../../core/services/utils';

@Component({
  selector: 'app-means-payement',
  template: `
    <app-settings-payment-means-form *ngIf="selectedPaymentMeans || newPaymentMeans"
                            (submitted)="onSubmit($event)"
                            [pending]="loading"
                            [paymentMeans]="selectedPaymentMeans"
                            [isNew]="newPaymentMeans">
    </app-settings-payment-means-form>
    <button mat-flat-button color="primary"
            *ngIf="!newPaymentMeans && !selectedPaymentMeans"
            (click)="createPaymentMeans()">Créer un moyen de paiement</button>
    <app-search [query]="searchQuery"
                [searching]="loading"
                (search)="search($event)"
                placeholder="Rechercher un moyen de paiement"></app-search>
    <app-settings-payment-means-list *ngIf="paymentMeans" [items]="paymentMeans"
                            (deleted)="delete($event)"
                            (selected)="select($event)"
                            [filter]="searchQuery"
                            itemName="le moyen de paiement">
    </app-settings-payment-means-list>
  `,
  styles: []
})
export class SettingsMeansPaymentComponent implements OnInit {
  searchQuery = '';
  loading = false;
  selectedPaymentMeans: PaymentMeans | null = null;
  paymentMeans: PaymentMeans[] | null = null;
  newPaymentMeans = false;

  constructor(private paymentMeansService: PaymentMeansService, private infoService: InfoService, private jsonLdService: JsonLdService) {}

  ngOnInit(): void {
    this.paymentMeansService.gets().subscribe((paymentMeans: PaymentMeans[]) => {
      this.paymentMeans = paymentMeans;
    });
  }

  search(event: string) {
    this.searchQuery = event;
  }

  createPaymentMeans() {
    this.newPaymentMeans = true;
  }

  select(idPaymentMeans: number) {
    this.newPaymentMeans = false;
    this.selectedPaymentMeans = this.paymentMeans.find(function(element) {
      return element.id === idPaymentMeans;
    });
  }

  delete(idPaymentMeans: number) {
    this.loading = true;
    this.paymentMeansService.delete(idPaymentMeans).subscribe(
      () => {
        this.paymentMeans = arrayRemoveById(this.paymentMeans, idPaymentMeans);
        this.infoService.pushSuccess('Moyen de paiement supprimé avec succès');
        this.loading = false;
      },
      (error) => {console.log('error'); console.log(error); this.infoService.pushError(error.toString()); this.loading = false; }
    );
  }

  onSubmit(paymentMeans) {
    this.loading = true;
    if (this.newPaymentMeans) {
      this.paymentMeansService.create(paymentMeans).subscribe(
        (newPaymentMeans) => {
          const newPaymentMeanss = this.paymentMeans.slice(0);
          newPaymentMeanss.push(newPaymentMeans);
          this.infoService.pushSuccess('Moyen de paiement créé avec succès');
          this.paymentMeans = newPaymentMeanss;
          this.newPaymentMeans = false;
          this.loading = false;
        },
        (error) => {console.log('error'); console.log(error); this.infoService.pushError(error.toString()); this.loading = false; },
      );
    } else {
      this.paymentMeansService.put(paymentMeans).subscribe(
        (updatedPaymentMeans) => {
          const newPaymentMeanss = this.paymentMeans.slice(0);
          for (let i = 0; i < newPaymentMeanss.length; i++) {
            if (newPaymentMeanss[i].id === updatedPaymentMeans.id) {
              newPaymentMeanss[i] = updatedPaymentMeans;
            }
          }
          this.infoService.pushSuccess('Moyen de paiement modifié avec succès');
          this.paymentMeans = newPaymentMeanss;
          this.loading = false;
          this.selectedPaymentMeans = null;
        },
        (error) => {console.log('error'); console.log(error); this.infoService.pushError(error.toString()); this.loading = false; },
      );
    }
  }


}
