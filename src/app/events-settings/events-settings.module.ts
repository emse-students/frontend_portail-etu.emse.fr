import { NgModule } from '@angular/core';

import { EventsSettingsRoutingModule } from './events-settings-routing.module';
import {SharedModule} from '../shared/shared.module';
import {NewEventComponent} from './containers/new-event.component';
import {EventFormComponent} from './components/event-form/event-form.component';
import { SelectAssoFormComponent } from './components/select-asso-form.component';
import { EventSettingsComponent } from './containers/event-settings.component';
import { EventCheckingComponent } from './containers/event-checking.component';
import { EventModifyComponent } from './containers/event-modify.component';
import { EventSummaryComponent } from './components/event-summary/event-summary.component';
import { BookingCheckingCardComponent } from './components/booking-checking-card.component';
import { EventExcelComponent } from './containers/event-excel.component';
import { EventListComponent } from './containers/event-list.component';
import { RegisteredListComponent } from './components/registered-list.component';
import { BookingFilterComponent } from './components/booking-filter.component';
import { EventAddBookingComponent } from './containers/event-add-booking.component';
import {EventsModule} from '../events/events.module';
import {MatSliderModule} from '@angular/material';

@NgModule({
  declarations: [
    NewEventComponent,
    EventFormComponent,
    SelectAssoFormComponent,
    EventSettingsComponent,
    EventCheckingComponent,
    EventModifyComponent,
    EventSummaryComponent,
    BookingCheckingCardComponent,
    EventExcelComponent,
    EventListComponent,
    RegisteredListComponent,
    BookingFilterComponent,
    EventAddBookingComponent
  ],
  imports: [
    SharedModule,
    EventsSettingsRoutingModule,
    EventsModule,
    MatSliderModule
  ],
  entryComponents: [
    EventSummaryComponent,
    EventCheckingComponent,
    EventModifyComponent
  ]
})
export class EventsSettingsModule { }
