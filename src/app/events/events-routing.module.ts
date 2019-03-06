import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CalendarComponent} from './containers/calendar.component';
import {BookComponent} from './containers/book.component';
import {ReviewComponent} from './containers/review.component';
import {MyBookingsComponent} from './containers/my-bookings.component';
import {BookingComponent} from './containers/booking.component';
import {AuthGuard} from '../core/services/auth-guard.service';





export const routes: Routes = [
  { path: '', component: CalendarComponent},
  { path: ':id/book', component: BookComponent},
  { path: ':id/review', component: ReviewComponent},
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard]},
  { path: 'booking/:id', component: BookingComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
