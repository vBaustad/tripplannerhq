import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  stripeCustomerId: string | null;
  subscriptionPriceId: string | null;
  subscriptionStatus: string | null;
  subscriptionCurrentPeriodEnd: string | null;
  homeCurrency: string;
  createdUtc: string;
  updatedUtc: string;
};

type SignupInput = {
  name: string;
  email: string;
  password: string;
  planPriceId: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: "idle" | "loading";
  signup: (input: SignupInput) => Promise<SignupStartResult>;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => void;
  updateCustomerId: (stripeCustomerId: string | null) => Promise<AuthUser>;
  completeSignup: (signupId: string, setupIntentId: string) => Promise<AuthUser>;
  updateProfile: (input: UpdateProfileInput) => Promise<AuthUser>;
  refreshSubscription: () => Promise<AuthUser>;
};

type SignupStartResult = {
  signupId: string;
  clientSecret: string;
  publishableKey: string | null;
  planPriceId: string;
};

type UpdateProfileInput = {
  name?: string;
  homeCurrency?: string;
};

const STORAGE_KEY = "tphq:auth-user";
const API_BASE = (import.meta.env?.VITE_API_URL ?? "").replace(/\/$/, "");

function loadStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown> | null;
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.id !== "string" || typeof parsed.email !== "string") {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      id: parsed.id,
      name: typeof parsed.name === "string" ? parsed.name : parsed.email,
      email: parsed.email,
      stripeCustomerId: typeof parsed.stripeCustomerId === "string" ? parsed.stripeCustomerId : null,
      subscriptionPriceId: typeof parsed.subscriptionPriceId === "string" ? parsed.subscriptionPriceId : null,
      subscriptionStatus: typeof parsed.subscriptionStatus === "string" ? parsed.subscriptionStatus : null,
      subscriptionCurrentPeriodEnd: typeof parsed.subscriptionCurrentPeriodEnd === "string"
        ? parsed.subscriptionCurrentPeriodEnd
        : null,
      homeCurrency: typeof parsed.homeCurrency === "string" ? parsed.homeCurrency : "USD",
      createdUtc: typeof parsed.createdUtc === "string" ? parsed.createdUtc : new Date().toISOString(),
      updatedUtc: typeof parsed.updatedUtc === "string" ? parsed.updatedUtc : new Date().toISOString(),
    };
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

function parseUserPayload(payload: unknown): AuthUser {
  if (!payload || typeof payload !== "object") {
    throw new Error("Malformed response from server.");
  }

  const record = payload as Record<string, unknown>;
  const value = record.user;
  if (!value || typeof value !== "object") {
    throw new Error("Malformed response from server.");
  }

  const user = value as Record<string, unknown>;
  const id = typeof user.id === "string" ? user.id : null;
  const email = typeof user.email === "string" ? user.email : null;
  if (!id || !email) {
    throw new Error("Missing account details in response.");
  }

  const name = typeof user.name === "string" && user.name.length > 0 ? user.name : email;
  const stripeCustomerId = typeof user.stripeCustomerId === "string" ? user.stripeCustomerId : null;
  const subscriptionPriceId = typeof user.subscriptionPriceId === "string" ? user.subscriptionPriceId : null;
  const subscriptionStatus = typeof user.subscriptionStatus === "string" ? user.subscriptionStatus : null;
  const subscriptionCurrentPeriodEnd = typeof user.subscriptionCurrentPeriodEnd === "string"
    ? user.subscriptionCurrentPeriodEnd
    : null;
  const homeCurrency = typeof user.homeCurrency === "string" && user.homeCurrency.length > 0 ? user.homeCurrency : "USD";
  const createdUtc = typeof user.createdUtc === "string" ? user.createdUtc : new Date().toISOString();
  const updatedUtc = typeof user.updatedUtc === "string" ? user.updatedUtc : createdUtc;

  return {
    id,
    name,
    email,
    stripeCustomerId,
    subscriptionPriceId,
    subscriptionStatus,
    subscriptionCurrentPeriodEnd,
    homeCurrency,
    createdUtc,
    updatedUtc,
  };
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
  const hasSyncedSubscription = useRef(false);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setUser(loadStoredUser());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const signup = useCallback(async ({ name, email, password, planPriceId }: SignupInput) => {
    setStatus("loading");
    try {
      if (!API_BASE) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, planPriceId }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, "Unable to create account."));
      }

      if (!payload || typeof payload !== "object" || payload === null) {
        throw new Error("Malformed response from server.");
      }

      const signupId = typeof (payload as Record<string, unknown>).signupId === "string"
        ? (payload as Record<string, unknown>).signupId
        : null;
      const clientSecret = typeof (payload as Record<string, unknown>).clientSecret === "string"
        ? (payload as Record<string, unknown>).clientSecret
        : null;
      const returnedPublishableKey = typeof (payload as Record<string, unknown>).publishableKey === "string"
        ? (payload as Record<string, unknown>).publishableKey
        : null;
      const returnedPlanPriceId = typeof (payload as Record<string, unknown>).planPriceId === "string"
        ? (payload as Record<string, unknown>).planPriceId
        : planPriceId;

      if (!signupId || !clientSecret) {
        throw new Error("Stripe signup session is incomplete.");
      }

      return {
        signupId,
        clientSecret,
        publishableKey: returnedPublishableKey,
        planPriceId: returnedPlanPriceId,
      } satisfies SignupStartResult;
    } finally {
      setStatus("idle");
    }
  }, [setStatus]);

  const login = useCallback(async ({ email, password }: LoginInput) => {
    setStatus("loading");
    try {
      if (!API_BASE) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, "Unable to log in."));
      }

      const nextUser = parseUserPayload(payload);
      persistUser(nextUser);
      setUser(nextUser);
      return nextUser;
    } finally {
      setStatus("idle");
    }
  }, [setStatus, setUser]);

  const logout = useCallback(() => {
    persistUser(null);
    setUser(null);
  }, [setUser]);

  const updateCustomerId = useCallback(async (stripeCustomerId: string | null) => {
    if (!user) {
      throw new Error("No active user session.");
    }

    if (!API_BASE) {
      const next = {
        ...user,
        stripeCustomerId: stripeCustomerId ?? null,
      };
      persistUser(next);
      setUser(next);
      return next;
    }

    const response = await fetch(`${API_BASE}/api/users/${user.id}/stripe-customer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stripeCustomerId }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(extractErrorMessage(payload, "Unable to update Stripe customer."));
    }

    const nextUser = parseUserPayload(payload);
    persistUser(nextUser);
    setUser(nextUser);
    hasSyncedSubscription.current = false;
    return nextUser;
  }, [setUser, user]);

  const completeSignup = useCallback(async (signupId: string, setupIntentId: string) => {
    setStatus("loading");
    try {
      if (!API_BASE) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${API_BASE}/api/auth/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId, setupIntentId }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(extractErrorMessage(payload, "Unable to finalize signup."));
      }

    const nextUser = parseUserPayload(payload);
    persistUser(nextUser);
    setUser(nextUser);
    hasSyncedSubscription.current = false;
    return nextUser;
  } finally {
      setStatus("idle");
    }
  }, [setStatus, setUser]);

  const updateProfile = useCallback(async ({ name, homeCurrency }: UpdateProfileInput) => {
    if (!user) {
      throw new Error("No active user session.");
    }

    if (!API_BASE) {
      const next = {
        ...user,
        name: name ? name.trim() || user.email : user.name,
        homeCurrency: homeCurrency ? homeCurrency.trim().toUpperCase() || user.homeCurrency : user.homeCurrency,
      };
      persistUser(next);
      setUser(next);
      return next;
    }

    const response = await fetch(`${API_BASE}/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: name,
        homeCurrency,
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(extractErrorMessage(payload, "Unable to update profile."));
    }

    const nextUser = parseUserPayload(payload);
    persistUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, [user]);

  const refreshSubscription = useCallback(async () => {
    if (!user) {
      throw new Error("No active user session.");
    }
    if (!API_BASE || !user.stripeCustomerId) {
      return user;
    }

    const response = await fetch(`${API_BASE}/api/users/${user.id}/subscription`);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(extractErrorMessage(payload, "Unable to refresh subscription."));
    }

    const nextUser = parseUserPayload(payload);
    persistUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, [user]);

  useEffect(() => {
    if (!user || !user.stripeCustomerId) return;
    if (!API_BASE) return;

    if (hasSyncedSubscription.current && user.subscriptionPriceId) {
      return;
    }

    hasSyncedSubscription.current = true;

    refreshSubscription().catch((error) => {
      console.warn("Failed to refresh subscription", error);
    });
  }, [user, refreshSubscription]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, signup, login, logout, updateCustomerId, completeSignup, updateProfile, refreshSubscription }),
    [user, status, signup, login, logout, updateCustomerId, completeSignup, updateProfile, refreshSubscription]
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
