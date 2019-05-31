import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AssociationsRoutingModule } from './associations-routing.module';
import { AssociationsReviewComponent } from './containers/associations-review/associations-review.component';
import { TextAreaFormComponent } from './components/text-area-form/text-area-form.component';
import { AddPositionFormComponent } from './components/add-position-form/add-position-form.component';
import { PositionsListComponent } from './components/positions-list.component';
import { EventsListComponent } from './components/events-list/events-list.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { TitleFormComponent } from './components/title-form.component';

@NgModule({
  declarations: [
    AssociationsReviewComponent,
    TextAreaFormComponent,
    AddPositionFormComponent,
    PositionsListComponent,
    EventsListComponent,
    EventCardComponent,
    TitleFormComponent,
  ],
  imports: [SharedModule, AssociationsRoutingModule],
})
export class AssociationsModule {}
