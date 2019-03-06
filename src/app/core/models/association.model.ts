import {FileDTO} from './file.model';
import {Position} from './position.model';
import {EventLight} from './event.model';

export interface Association {
  id: number;
  name: string;
  tag: string;
  description: string;
  color: string;
  logo: FileDTO;
  lastActionDate: string;
  positions: Position[];
  events: EventLight[];
  isList: boolean;
}

export interface NewAssociation {
  name: string;
  tag: string;
  isList?: boolean;
}

export interface AssociationLight {
  id: number;
  name: string;
  tag: string;
  isList: boolean;
}

export interface AssociationDTO {
  id: number;
  name?: string;
  tag?: string;
  description?: string;
  color?: string;
  logo?: string;
  lastActionDate?: string;
  positions?: Position[];
}
