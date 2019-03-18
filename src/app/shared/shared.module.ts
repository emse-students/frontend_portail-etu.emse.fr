import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {HttpClientModule} from '@angular/common/http';
import {MatDatepickerModule, MatExpansionModule, MatNativeDateModule, MatRadioModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {RouterModule} from '@angular/router';
import {HourPipe} from './pipes/hour.pipe';
import {TranslateDayPipe} from './pipes/translate-day.pipe';
import {TranslateMonthPipe} from './pipes/translate-month.pipe';
import {SearchComponent} from './components/search.component';
import {EscapeHtmlPipe} from './pipes/escape-html.pipe';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { OrderByPipe } from './pipes/order-by.pipe';
import { TranslateStatusPipe } from './pipes/translate-status.pipe';
import {ResolveComponentDirective} from './directives/resolve-component.directive';
import { DateDifferencePipe } from './pipes/date-difference.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,

    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatRadioModule,

    AngularSvgIconModule,
  ],
  declarations: [
    HourPipe,
    TranslateDayPipe,
    TranslateMonthPipe,
    EscapeHtmlPipe,

    SearchComponent,

    OrderByPipe,
    TranslateStatusPipe,

    ResolveComponentDirective,

    DateDifferencePipe
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,

    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatRadioModule,

    AngularSvgIconModule,

    HourPipe,
    TranslateDayPipe,
    TranslateMonthPipe,
    EscapeHtmlPipe,
    OrderByPipe,
    TranslateStatusPipe,
    ResolveComponentDirective,
    DateDifferencePipe,

    SearchComponent,
  ]
})
export class SharedModule {}
