export interface Token {
  bearer: string;
  exp: number;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  type: string;
  token: Token;
}

export interface UserLight {
  id: number;
  firstname: string;
  lastname: string;
  type: string;
  promo: number;
}


