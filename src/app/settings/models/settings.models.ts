import { SettingsRolesComponent } from '../containers/settings-roles.component';
import { SettingsAssociationsComponent } from '../containers/settings-associations.component';
import { SettingsMeansPaymentComponent } from '../containers/settings-means-payment.component';
import { SettingsListsComponent } from '../containers/settings-lists.component';

export interface Setting {
  id: number;
  strId: string;
  name: string;
  component: any;
}

export const SETTINGS: Setting[] = [
  {
    id: 0,
    strId: 'associations',
    name: 'Associations',
    component: SettingsAssociationsComponent,
  },
  {
    id: 1,
    strId: 'lists',
    name: 'Listes',
    component: SettingsListsComponent,
  },
  {
    id: 2,
    strId: 'roles',
    name: 'Roles',
    component: SettingsRolesComponent,
  },
  {
    id: 3,
    strId: 'means-of-payment',
    name: 'Moyens de payement',
    component: SettingsMeansPaymentComponent,
  },
];

export function strIdToTabId(strId: string) {
  for (let _i = 0; _i < SETTINGS.length; _i++) {
    if (SETTINGS[_i].strId === strId) {
      return SETTINGS[_i].id;
    }
  }
  return -1;
}
