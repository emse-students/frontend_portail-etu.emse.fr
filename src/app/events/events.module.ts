import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { EventsRoutingModule } from './events-routing.module';
import { BookComponent } from './containers/book.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { ReviewComponent } from './containers/review.component';
import { MyBookingsComponent } from './containers/my-bookings.component';
import { BookingComponent } from './containers/booking.component';
import { BookingsListComponent } from './components/bookings-list/bookings-list.component';
import { ListComponent } from './containers/list.component';
import { EventBookingsListComponent } from './components/event-bookings-list.component';

@NgModule({
  declarations: [
    BookComponent,
    ReviewComponent,
    BookingFormComponent,
    MyBookingsComponent,
    BookingComponent,
    BookingsListComponent,
    ListComponent,
    EventBookingsListComponent,
  ],
  imports: [SharedModule, EventsRoutingModule],
  exports: [BookingFormComponent],
})
export class EventsModule {}
