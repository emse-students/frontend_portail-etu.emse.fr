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
    EventExcelComponent
  ],
  imports: [
    SharedModule,
    EventsSettingsRoutingModule
  ],
  entryComponents: [
    EventSummaryComponent,
    EventCheckingComponent,
    EventModifyComponent
  ]
})
export class EventsSettingsModule { }
