export interface JwtPayload {
  user: string;
  iat: number;
  exp: number;
}
