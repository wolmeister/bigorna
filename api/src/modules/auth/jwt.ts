import { sign, verify } from 'jsonwebtoken';

type JwtPayload = {
  id: string;
};

// @TODO: Add to env
const JWT_SECRET = 'SUPERBIGORNASECRET';

export function signJwt(payload: JwtPayload): string {
  return sign(payload, JWT_SECRET);
}

export function verifyJwt(jwt: string): JwtPayload {
  const decoded = verify(jwt, JWT_SECRET);
  return decoded as JwtPayload;
}
