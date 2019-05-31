import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Booking } from '../../core/models/event.model';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-my-bookings',
  template: `
    <div class="container">
      <mat-card *ngIf="loaded">
        <mat-card-title class="h4">Mes réservations</mat-card-title>
        <app-bookings-list [bookings]="bookings"></app-bookings-list>
      </mat-card>
    </div>
    <div class="centrer" *ngIf="!loaded">
      <mat-spinner [diameter]="200" [strokeWidth]="5"></mat-spinner>
    </div>
  `,
  styles: [
    `
      mat-card-title,
      mat-card-content,
      mat-card-footer {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class MyBookingsComponent implements OnInit {
  loaded = false;
  bookings: Booking[];
  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      if (!authenticatedUser) {
        setTimeout(() => {
          this.router.navigate(['/home']);
        });
      }
    });
    this.userService.getBookings().subscribe(bookings => {
      this.bookings = bookings;
      // console.log(bookings);
      this.loaded = true;
    });
  }
}
