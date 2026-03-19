import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_this';

export function signToken(payload: object, opts?: jwt.SignOptions) {
  return jwt.sign(payload, SECRET, { ...(opts || {}) });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
