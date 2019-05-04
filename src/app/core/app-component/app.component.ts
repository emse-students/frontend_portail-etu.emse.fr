import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AuthenticatedUser} from '../models/auth.model';
import {NavItem, NavLink} from '../models/nav.model';
import {ALL_NAV_LINKS, NAV_LINKS} from '../data/nav.data';
import {AssociationLight} from '../models/association.model';
import {NavService} from '../services/nav.service';
import {AssociationService} from '../services/association.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user.model';
import {ActivatedRoute, Router} from '@angular/router';


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
  authPending = true;
  $cercleUser: Observable<any>;
  user: User;
  assoLoaded = false;
  listsLoaded = false;
  navItems: NavItem[] = [];
  get authService() { return this._authService; }

  constructor(
    private _authService: AuthService,
    private associationService: AssociationService,
    private navService: NavService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.navItems.push({
      displayName: 'Associations',
      route: '',
      children: []
    });
    this.navItems.push({
      displayName: 'Listes',
      route: '',
      children: []
    });
    this.navItems.push({
      displayName: 'Autres Sites',
      route: '',
      children: []
    });
    for (let i = 0; i < NAV_LINKS.length; i++) {
      this.navItems[2].children.push({
        displayName: NAV_LINKS[i].label,
        route: NAV_LINKS[i].link
      });
    }
    this.allNav = ALL_NAV_LINKS;
    this._authService.authenticatedUser.subscribe(authenticatedUser => {
      // console.log(authenticatedUser);
     this.authPending = false;
     this.authenticatedUser = authenticatedUser;
     if (authenticatedUser && (!this.user || authenticatedUser.id !== this.user.id)) {
       this.userService.getInfo();
     }
    });
    this.associationService.allAssos.subscribe((assos: AssociationLight[] | null) => {
      if (!this.assoLoaded) {
        const newNav = this.allNav.slice(0);
        for (let i = 0; i < assos.length; i++) {
          newNav.push({label: assos[i].name, link: '/associations/' + assos[i].tag});
          this.navItems[0].children.push({
            displayName: assos[i].name,
            route: '/associations/' + assos[i].tag
          });
        }
        this.allNav = newNav;
        this.assoLoaded = true;
      }
    });
    this.associationService.allLists.subscribe((assos: AssociationLight[] | null) => {
      if (! this.listsLoaded) {
        const newNav = this.allNav.slice(0);
        for (let i = 0; i < assos.length; i++) {
          newNav.push({label: assos[i].name, link: '/associations/' + assos[i].tag});
          this.navItems[1].children.push({
            displayName: assos[i].name,
            route: '/associations/' + assos[i].tag
          });
        }
        this.allNav = newNav;
        this.listsLoaded = true;
      }
    });
    this.$cercleUser = of({solde: '20€'});
    this.userService.user.subscribe((user) => {this.user = user; });
    this._authService.refresh();
    this.associationService.getLights();
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  navServiceCloseNav() {
    this.navService.closeNav();
  }

  navServiceOpenNav() {
    this.navService.openNav();
  }

  onLogoutClick() {
    this.closeSidenav();
    this._authService.logout();
    this.router.navigate([]);
  }

  onLoginClick() {
    this.authPending = true;
    this._authService.login();
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
