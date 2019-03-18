import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {EventsRoutingModule} from './events-routing.module';
import { BookComponent } from './containers/book.component';
import { CalendarComponent } from './containers/calendar.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';
import { EventDescriptionComponent } from './components/event-description.component';
import { ReviewComponent } from './containers/review.component';
import { MyBookingsComponent } from './containers/my-bookings.component';
import { BookingComponent } from './containers/booking.component';
import { BookingsListComponent } from './components/bookings-list/bookings-list.component';
import { ListComponent } from './containers/list.component';
import { EventBookingsListComponent } from './components/event-bookings-list.component';


@NgModule({
  declarations: [
    BookComponent,
    CalendarComponent,
    ReviewComponent,
    BookingFormComponent,
    EventDescriptionComponent,
    MyBookingsComponent,
    BookingComponent,
    BookingsListComponent,
    ListComponent,
    EventBookingsListComponent
  ],
  imports: [
    SharedModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
