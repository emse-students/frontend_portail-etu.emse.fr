import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BdeComponent } from './containers/bde.component';
import { BdeAccountComponent } from './containers/bde-account.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'account/:id',
    component: BdeAccountComponent,
  },
  {
    path: ':id',
    component: BdeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BdeRoutingModule {}
