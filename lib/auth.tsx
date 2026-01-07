"use client";

import * as React from "react";

import type { User, UserRole } from "@/types/auth";

type AuthState = {
  user: User | null;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: Exclude<UserRole, "ADMIN">;
};

type AuthContextValue = {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<{ error?: string }>;
  register: (input: RegisterInput) => Promise<{ error?: string }>;
  logout: () => void;
};

const TOKEN_KEY = "iqmento.auth.token";
const USER_KEY = "iqmento.auth.user";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>({ user: null });
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch user on mount if token exists
  React.useEffect(() => {
    if (typeof window === "undefined") {
      setIsHydrated(true);
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const storedUser = safeParse<User>(localStorage.getItem(USER_KEY));

    if (token && storedUser) {
      setState({ user: storedUser });
      // Verify token is still valid by fetching current user
      fetch("/api/auth/me", { headers: getAuthHeaders() })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Invalid token");
        })
        .then((data) => {
          if (data.user) {
            setState({ user: data.user });
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          }
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setState({ user: null });
        })
        .finally(() => {
          setIsHydrated(true);
        });
    } else {
      setIsHydrated(true);
    }
  }, []);

  const persist = React.useCallback((user: User | null, token: string | null) => {
    setState({ user });
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
      if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const login = React.useCallback(async (input: LoginInput): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.email, password: input.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return { error: data.error || "Login failed" };
      }

      persist(data.user, data.token);
      setIsLoading(false);
      return {};
    } catch {
      setIsLoading(false);
      return { error: "Network error. Please try again." };
    }
  }, [persist]);

  const register = React.useCallback(async (input: RegisterInput): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: input.email,
          password: input.password,
          name: input.name,
          role: input.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        return { error: data.error || "Registration failed" };
      }

      persist(data.user, data.token);
      setIsLoading(false);
      return {};
    } catch {
      setIsLoading(false);
      return { error: "Network error. Please try again." };
    }
  }, [persist]);

  const logout = React.useCallback(() => {
    persist(null, null);
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {
      // Ignore logout API errors
    });
  }, [persist]);

  const value = React.useMemo<AuthContextValue>(() => {
    const role = state.user?.role ?? null;
    return {
      user: state.user,
      role,
      isAuthenticated: Boolean(state.user),
      isHydrated,
      isLoading,
      login,
      register,
      logout,
    };
  }, [state.user, isHydrated, isLoading, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}


