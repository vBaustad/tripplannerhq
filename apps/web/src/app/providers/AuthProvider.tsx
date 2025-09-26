import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthUser = {
  name: string;
  email: string;
  passwordHash: string;
  stripeCustomerId: string | null;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: "idle" | "loading";
  signup: (input: SignupInput) => Promise<AuthUser>;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => void;
  updateCustomerId: (stripeCustomerId: string) => void;
};

const STORAGE_KEY = "tphq:auth-user";
const API_BASE = (import.meta.env?.VITE_API_URL ?? "").replace(/\/$/, "");

function loadStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch (err) {
    console.warn("Failed to parse stored user", err);
    return null;
  }
}

function persistUser(value: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (!value) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function hashPassword(password: string) {
  return btoa(unescape(encodeURIComponent(password)));
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && payload !== null && "error" in payload) {
    const value = (payload as Record<string, unknown>).error;
    if (typeof value === "string") return value;
  }
  return fallback;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = { children?: ReactNode };

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setUser(loadStoredUser());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const signup = async ({ name, email, password }: SignupInput) => {
    setStatus("loading");
    try {
      let stripeCustomerId: string | null = null;

      if (API_BASE) {
        const response = await fetch(`${API_BASE}/api/create-customer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        });

        let payload: unknown = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }

        if (!response.ok) {
          throw new Error(extractErrorMessage(payload, "Unable to create Stripe customer"));
        }

        if (payload && typeof payload === "object" && payload !== null && "customerId" in payload) {
          const value = (payload as Record<string, unknown>).customerId;
          if (typeof value === "string" && value.length > 0) {
            stripeCustomerId = value;
          }
        }
      }

      const nextUser: AuthUser = {
        name,
        email,
        passwordHash: hashPassword(password),
        stripeCustomerId,
      };
      persistUser(nextUser);
      setUser(nextUser);
      return nextUser;
    } finally {
      setStatus("idle");
    }
  };

  const login = async ({ email, password }: LoginInput) => {
    setStatus("loading");
    try {
      const stored = loadStoredUser();
      if (!stored || stored.email.toLowerCase() !== email.toLowerCase()) {
        throw new Error("No account found for that email.");
      }
      if (stored.passwordHash !== hashPassword(password)) {
        throw new Error("Incorrect password.");
      }
      setUser(stored);
      return stored;
    } finally {
      setStatus("idle");
    }
  };

  const logout = () => {
    persistUser(null);
    setUser(null);
  };

  const updateCustomerId = (stripeCustomerId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, stripeCustomerId };
      persistUser(next);
      return next;
    });
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signup, login, logout, updateCustomerId }),
    [user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
