import jwt from 'jsonwebtoken';
import { SessionUser } from '@/app/types/auth';
import { UserRole } from '@/app/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';



export function generateToken(user: SessionUser): string {
  return jwt.sign(
    {
      id: user.id,
      fullName: user.fullName,
      employeeId: user.employeeId,
      department: user.department,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' } // Token 有效期 7 天
  );
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      fullName: string;
      employeeId: string;
      department: string;
      role: UserRole;
    };
    return {
      id: decoded.id,
      fullName: decoded.fullName,
      employeeId: decoded.employeeId,
      department: decoded.department,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
