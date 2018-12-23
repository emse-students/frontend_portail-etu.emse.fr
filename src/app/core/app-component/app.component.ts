import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AuthenticatedUser} from '../models/auth.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  navigation;
  logo = '../../../../assets/logo_bde.png';
  year = new Date().getFullYear();
  showSidenav = false;
  showUsernav = false;
  authenticatedUser: AuthenticatedUser | null;
  $cercleUser: Observable<any>;
  $bdeUser: Observable<any>;
  isLoginPage = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.navigation = [
      {
        label: 'Home',
        link: '/'
      },
      {
        label: 'Page 1',
        link: '/page1'
      },
      {
        label: 'Page 2',
        link: '/page2'
      },
      {
        label: 'Page 3',
        link: '/page3'
      },
    ];
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      // console.log(authenticatedUser);
      this.authenticatedUser = authenticatedUser;
    });
    this.$cercleUser = of({solde: '20€'});
    this.$bdeUser = of({solde: '10€'});
    this.authService.refresh();
  }

  onLogoutClick() {
    this.authService.logout();
    this.closeSidenav();
  }

  onLoginClick() {
    this.authService.login();
  }

  closeSidenav() {
    this.showSidenav = false;
    this.showUsernav = false;
  }

  openSidenav() {
    this.showSidenav = true;
  }

  openUsernav() {
    this.showUsernav = true;
  }
}
