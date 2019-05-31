export interface Token {
  bearer: string;
  exp: number;
}

export interface AuthenticatedUser {
  id: number;
  login: string;
  email: string;
  firstname: string;
  lastname: string;
  roles: string[];
  type: string;
  contributeBDE: boolean;
  token: Token;
}

export interface UserLight {
  id: number;
  firstname: string;
  lastname: string;
  login: string;
  type: string;
  promo: number;
  balance: number;
  cercleBalance: number;
  contributeBDE: boolean;
  contributeCercle: boolean;
  username?: string;
  bookingIndex?: number;
}

export interface EventUser {
  username?: string;
  idBooking?: number;
  id?: number;
  firstname?: string;
  lastname?: string;
  login?: string;
  type?: string;
  promo?: number;
  balance?: number;
  cercleBalance?: number;
  contributeBDE?: boolean;
  contributeCercle?: boolean;
  bookingIndex?: number;
}
