export interface Right {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  hierarchy: number;
  rights: Right[];
}

export interface NewRole {
  name: string;
  hierarchy: number;
  rights: Right[];
}
