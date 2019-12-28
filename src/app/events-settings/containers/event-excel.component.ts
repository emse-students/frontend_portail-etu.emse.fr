import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../core/models/event.model';
import { ExcelService } from '../../core/services/excel.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-event-excel',
  template: `
    <div class="row justify-content-center" *ngIf="!loading">
      <button class="m-2" mat-flat-button color="primary" (click)="generate()">
        Générer l'excel des réservations
      </button>
    </div>
    <div class="row justify-content-center" *ngIf="loading">
      <mat-spinner [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [],
})
export class EventExcelComponent implements OnInit {
  @Input() event: Event;
  loading = false;
  constructor(private excelService: ExcelService) {}

  ngOnInit() {}

  generate() {
    this.loading = true;
    this.excelService.generateBookingExcel(this.event.id).subscribe(
      ans => {
        this.loading = false;
        window.open(`${environment.excelUrl}/${ans.name}`);
      },
      () => {
        this.loading = false;
      },
    );
  }
}
