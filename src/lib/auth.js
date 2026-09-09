import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'doganperde_default_secret_key_123';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Extract and verify user from requests
export function getAuthenticatedUser(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenCookie = cookieHeader
    .split(';')
    .find(c => c.trim().startsWith('token='));
  
  if (!tokenCookie) return null;
  
  const token = tokenCookie.split('=')[1];
  if (!token) return null;
  
  return verifyToken(token);
}
