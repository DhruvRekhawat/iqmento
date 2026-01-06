"use client";

import * as React from "react";

import type { User, UserRole } from "@/types/auth";

type AuthState = {
  user: User | null;
};

type LoginInput = {
  email: string;
  role?: UserRole;
  name?: string;
};

type RegisterInput = {
  name: string;
  email: string;
  role: Exclude<UserRole, "ADMIN">;
};

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (input: LoginInput) => void;
  register: (input: RegisterInput) => void;
  logout: () => void;
};

const STORAGE_KEY = "iqmento.auth.v1";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function makeUserId(email: string) {
  // stable-ish id for mock UI; not security related
  return `u_${email.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
}

function defaultNameFromEmail(email: string) {
  const [local] = email.split("@");
  const cleaned = (local || "User").replace(/[._-]+/g, " ").trim();
  return cleaned.length > 0
    ? cleaned.replace(/\b\w/g, (m) => m.toUpperCase())
    : "User";
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ user: null });
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = safeParse<AuthState>(window.localStorage.getItem(STORAGE_KEY));
    if (stored?.user) {
      setState({ user: stored.user });
    }
    setIsHydrated(true);
  }, []);

  const persist = React.useCallback((next: AuthState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage failures (private mode / quota)
    }
  }, []);

  const login = React.useCallback(
    (input: LoginInput) => {
      const email = input.email.trim().toLowerCase();
      if (!email) return;

      const nextUser: User = {
        id: makeUserId(email),
        email,
        name: input.name?.trim() || defaultNameFromEmail(email),
        role: input.role || "STUDENT",
      };

      persist({ user: nextUser });
    },
    [persist]
  );

  const register = React.useCallback(
    (input: RegisterInput) => {
      const email = input.email.trim().toLowerCase();
      if (!email) return;

      const nextUser: User = {
        id: makeUserId(email),
        email,
        name: input.name.trim() || defaultNameFromEmail(email),
        role: input.role,
      };

      persist({ user: nextUser });
    },
    [persist]
  );

  const logout = React.useCallback(() => {
    persist({ user: null });
  }, [persist]);

  const value = React.useMemo<AuthContextValue>(() => {
    const role = state.user?.role ?? null;
    return {
      user: state.user,
      role,
      isAuthenticated: Boolean(state.user),
      isHydrated,
      login,
      register,
      logout,
    };
  }, [state.user, isHydrated, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}


