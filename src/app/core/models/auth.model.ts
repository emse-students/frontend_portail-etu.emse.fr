export interface Token {
  bearer: string;
  exp: number;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  type: string;
  token: Token;
}


