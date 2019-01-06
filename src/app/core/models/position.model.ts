import {Association} from './association.model';
import {UserLight} from './auth.model';
import {Role} from './role.model';

export interface Position {
  id: number;
  association?: Association;
  user: UserLight;
  role: Role;
  loading?: boolean;
}


export interface NewPosition {
  association: string;
  user: string;
  role: string;
}
