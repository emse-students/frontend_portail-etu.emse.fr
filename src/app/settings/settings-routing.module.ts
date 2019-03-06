import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from './containers/settings/settings.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'associations',
    pathMatch: 'full'
  },
  { path: ':id', component: SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
