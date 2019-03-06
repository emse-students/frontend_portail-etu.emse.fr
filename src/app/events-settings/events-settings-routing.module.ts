import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NewEventComponent} from './containers/new-event.component';
import {EventSettingsComponent} from './containers/event-settings.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'new',
    pathMatch: 'full'
  },
  { path: 'new', component: NewEventComponent },
  {
    path: ':id',
    redirectTo: ':id/summary',
    pathMatch: 'full'
  },
  { path: ':id/:setting', component: EventSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsSettingsRoutingModule { }
