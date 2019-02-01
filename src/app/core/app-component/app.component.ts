import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AuthenticatedUser} from '../models/auth.model';
import {NavItem, NavLink} from '../models/nav.model';
import {ALL_NAV_LINKS, NAV_LINKS} from '../data/nav.data';
import {AssociationLight} from '../models/association.model';
import {NavService} from '../services/nav.service';
import {AssociationService} from '../services/association.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav') appDrawer: ElementRef;
  allNav: NavLink[];
  logo = '../../../../assets/logo_bde.png';
  year = new Date().getFullYear();
  showSidenav = false;
  showUsernav = false;
  authenticatedUser: AuthenticatedUser | null;
  $cercleUser: Observable<any>;
  $bdeUser: Observable<any>;
  isLoginPage = false;
  assoLoaded = false;
  navItems: NavItem[] = [];
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private associationService: AssociationService,
    private navService: NavService) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.navItems.push({
      displayName: 'Pages',
      route: '',
      children: []
    });
    for (let i = 0; i < NAV_LINKS.length; i++) {
      this.navItems[0].children.push({
        displayName: NAV_LINKS[i].label,
        route: NAV_LINKS[i].link
      });
    }
    this.allNav = ALL_NAV_LINKS;
    this.authService.authenticatedUser.subscribe(authenticatedUser => {
      console.log(authenticatedUser);
      this.authenticatedUser = authenticatedUser;
    });
    this.associationService.allAssos.subscribe((assos: AssociationLight[] | null) => {
      if (!this.assoLoaded) {
        const newNav = this.allNav.slice(0);
        this.navItems.push({
          displayName: 'Associations',
          route: '',
          children: []
        });
        for (let i = 0; i < assos.length; i++) {
          newNav.push({label: assos[i].name, link: '/associations/' + assos[i].tag});
          this.navItems[1].children.push({
            displayName: assos[i].name,
            route: '/associations/' + assos[i].tag
          });
        }
        this.allNav = newNav;
        this.assoLoaded = true;
      }
    });
    this.$cercleUser = of({solde: '20€'});
      this.$bdeUser = of({solde: '10€'});
    this.authService.refresh();
    this.associationService.getLights();
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
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
