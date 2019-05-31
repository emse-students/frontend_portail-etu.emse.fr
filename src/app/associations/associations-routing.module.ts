import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssociationsReviewComponent } from './containers/associations-review/associations-review.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'bde',
    pathMatch: 'full',
  },
  { path: ':id', component: AssociationsReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssociationsRoutingModule {}
