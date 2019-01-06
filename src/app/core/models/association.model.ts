import {FileDTO} from './file.model';
import {Position} from './position.model';

export interface Association {
  id: number;
  name: string;
  tag: string;
  description: string;
  color: string;
  logo: FileDTO;
  lastActionDate: string;
  positions: Position[];
}

export interface AssociationLight {
  id?: number;
  name: string;
  tag: string;
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
