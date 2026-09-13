export type UserRole = "user" | "institution";

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  email: string;
  organization?: string;
  department?: string;
  badge?: string;
  avatarUrl?: string;
  joinedYear?: string;
  archivalAccessLevel?: "standard" | "researcher" | "institutional_admin";
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: UserProfile;
}
