import { NgModule } from '@angular/core';
import { SettingsComponent } from './containers/settings/settings.component';
import {SharedModule} from '../shared/shared.module';
import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsRolesComponent} from './containers/settings-roles.component';
import {SettingsAssociationsComponent} from './containers/settings-associations.component';
import {SettingsMeansPaymentComponent} from './containers/settings-means-payment.component';
import { SettingsAssoListComponent } from './components/settings-asso-list/settings-asso-list.component';
import { SettingsAssoFormComponent } from './components/settings-asso-form/settings-asso-form.component';
import { SettingsRoleFormComponent } from './components/settings-role-form/settings-role-form.component';
import { SettingsNameListComponent } from './components/settings-name-list/settings-name-list.component';
import { SettingsPaymentMeansFormComponent } from './components/settings-payment-means-form.component';

@NgModule({
  imports: [
    SharedModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent,
    SettingsRolesComponent,
    SettingsAssociationsComponent,
    SettingsMeansPaymentComponent,
    SettingsAssoListComponent,
    SettingsAssoFormComponent,
    SettingsRoleFormComponent,
    SettingsNameListComponent,
    SettingsPaymentMeansFormComponent
  ],
  entryComponents: [
    SettingsAssociationsComponent,
    SettingsRolesComponent,
    SettingsMeansPaymentComponent
  ]
})
export class SettingsModule {}
