import { Component, Input, OnInit } from '@angular/core';
import { EventLight } from '../../../core/models/event.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Association } from '../../../core/models/association.model';
import { AuthenticatedUser } from '../../../core/models/auth.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() asso: Association;
  today = new Date();
  allReadyBooked = false;
  _event: EventLight;
  authenticatedUser: AuthenticatedUser;
  @Input()
  set event(event: EventLight) {
    this._event = event;
    this.allReadyBooked = this.userService.hasBooked(event.id);
  }
  get event() {
    return this._event;
  }

  @Input() isRightful: boolean;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      this.authenticatedUser = authenticatedUser;
      this.allReadyBooked = this.userService.hasBooked(this.event.id);
    });
  }
}
