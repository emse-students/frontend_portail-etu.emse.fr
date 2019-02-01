import { NgModule } from '@angular/core';

import { EventsSettingsRoutingModule } from './events-settings-routing.module';
import {SharedModule} from '../shared/shared.module';
import {NewEventComponent} from './containers/new-event.component';
import {EventFormComponent} from './components/event-form/event-form.component';
import { SelectAssoFormComponent } from './components/select-asso-form.component';
import { EventSettingsComponent } from './containers/event-settings.component';
import { EventSummaryComponent } from './containers/event-summary.component';
import { EventCheckingComponent } from './containers/event-checking.component';
import { EventModifyComponent } from './containers/event-modify.component';

@NgModule({
  declarations: [
    NewEventComponent,
    EventFormComponent,
    SelectAssoFormComponent,
    EventSettingsComponent,
    EventSummaryComponent,
    EventCheckingComponent,
    EventModifyComponent
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
