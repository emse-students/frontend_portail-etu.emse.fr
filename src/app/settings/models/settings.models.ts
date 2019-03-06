import {SettingsRolesComponent} from '../containers/settings-roles.component';
import {SettingsAssociationsComponent} from '../containers/settings-associations.component';
import {SettingsMeansPaymentComponent} from '../containers/settings-means-payment.component';
import {SettingsListsComponent} from '../containers/settings-lists.component';

export interface Setting {
  id: number;
  str_id: string;
  name: string;
  component: any;
}



export const SETTINGS: Setting[] = [
  {
    id: 0,
    str_id: 'associations',
    name: 'Associations',
    component: SettingsAssociationsComponent
  },
  {
    id: 1,
    str_id: 'lists',
    name: 'Listes',
    component: SettingsListsComponent
  },
  {
    id: 2,
    str_id: 'roles',
    name: 'Roles',
    component: SettingsRolesComponent
  },
  {
    id: 3,
    str_id: 'means-of-payment',
    name: 'Moyens de payement',
    component: SettingsMeansPaymentComponent
  }
];

export function strIdToTabId(strId: string) {
  for (let _i = 0; _i < SETTINGS.length; _i++) {
    if ( SETTINGS[_i].str_id === strId ) {
      return SETTINGS[_i].id;
    }
  }
  return -1;
}
