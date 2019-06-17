import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewEventComponent } from './containers/new-event.component';
import { EventSettingsComponent } from './containers/event-settings.component';
import { NewEventBandComponent } from './containers/new-event-band.component';
import { ModifyEventBandComponent } from './containers/modify-event-band.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full',
  },
  { path: 'new', component: NewEventComponent },
  { path: 'new/:id', component: NewEventComponent },
  { path: 'new-band', component: NewEventBandComponent },
  { path: 'band/:id', component: ModifyEventBandComponent },
  {
    path: ':id',
    redirectTo: ':id/summary',
    pathMatch: 'full',
  },
  { path: ':id/:setting', component: EventSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsSettingsRoutingModule {}
