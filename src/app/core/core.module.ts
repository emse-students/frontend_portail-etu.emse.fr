import {NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app-component/app.component';
import { NotFoundPageComponent } from './components/not-found-page.component';

import {SharedModule} from '../shared/shared.module';
import {InfoComponent} from './components/info.component';
import {AuthService} from './services/auth.service';
import {InfoService} from './services/info.service';
import {ErrorInterceptorService} from './services/error-interceptor.service';
import {JwtInterceptorService} from './services/jwt-interceptor.service';
import {UrlSafeStringService} from './services/url-safe-string.service';
import {JsonLdService} from './services/json-ld.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {MenuListItemComponent} from './components/menu-list-item/menu-list-item.component';




export const COMPONENTS = [
  AppComponent,
  NotFoundPageComponent,
  InfoComponent,
  MenuListItemComponent
];

export const SERVICES = [
  AuthService,
  InfoService,
  UrlSafeStringService,
  JsonLdService,
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {

  constructor(
    @Optional()
    @SkipSelf()
      parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }

  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: SERVICES,
    };
  }
}
