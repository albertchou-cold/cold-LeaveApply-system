export interface User {
  id: string;
  email: string;
  fullName: string;
  employeeId: string;
  department: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt?: string;
}

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export interface UserRegistrationRequest {
  email: string;
  password: string;
  fullName: string;
  employeeId: string;
  department: string;
  role: UserRole;
}

export interface UserLoginRequest {
  userId: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  error?: string;
}

export interface SessionUser {
  id: string;
  fullName: string;
  employeeId: string;
  department: string;
  role: UserRole;
}
