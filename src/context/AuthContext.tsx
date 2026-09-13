import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserProfile, UserRole, LoginResult } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role?: UserRole) => Promise<LoginResult>;
  quickLogin: (username: string) => void;
  logout: () => void;
}

// Sample mock users defined in user requirements
export const MOCK_USERS: Record<string, UserProfile & { password: string }> = {
  john_doe: {
    id: "user-john-doe",
    username: "John_doe",
    name: "John Doe",
    role: "user",
    roleLabel: "Researcher / Student",
    email: "john.doe@research.edu",
    organization: "Centre for Social Justice & Archival Studies",
    department: "Department of Modern History",
    badge: "Senior Researcher",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    joinedYear: "2023",
    archivalAccessLevel: "researcher",
    password: "password123",
  },
  dait: {
    id: "inst-dait",
    username: "DAIT",
    name: "Dr. Ambedkar Institute of Technology",
    role: "institution",
    roleLabel: "Archival Institution",
    email: "archive@dait.edu.in",
    organization: "DAIT Digital Heritage Repository",
    department: "Archival & Special Collections Unit",
    badge: "Verified Institution",
    avatarUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80",
    joinedYear: "2021",
    archivalAccessLevel: "institutional_admin",
    password: "password123",
  },
};

const STORAGE_KEY = "ambedkar_archive_user_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserProfile;
      }
    } catch (e) {
      console.error("Failed to parse stored auth session", e);
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (username: string, password: string, selectedRole?: UserRole): Promise<LoginResult> => {
    // Simulate slight delay for authentic feel
    await new Promise((res) => setTimeout(res, 400));

    const key = username.trim().toLowerCase();
    const targetUser = MOCK_USERS[key];

    if (!targetUser) {
      return {
        success: false,
        message: `Account "${username}" not found. Sample accounts are: John_doe or DAIT.`,
      };
    }

    if (targetUser.password !== password) {
      return {
        success: false,
        message: "Incorrect password. (Hint: password123)",
      };
    }

    if (selectedRole && targetUser.role !== selectedRole) {
      const roleText = targetUser.role === "institution" ? "Institution" : "User (Researcher/Student)";
      return {
        success: false,
        message: `Account "${targetUser.username}" is registered as an ${roleText}. Please select the ${roleText} tab to sign in.`,
      };
    }

    const { password: _, ...profile } = targetUser;
    setUser(profile);
    return {
      success: true,
      user: profile,
    };
  };

  const quickLogin = (username: string) => {
    const key = username.trim().toLowerCase();
    const targetUser = MOCK_USERS[key];
    if (targetUser) {
      const { password: _, ...profile } = targetUser;
      setUser(profile);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
