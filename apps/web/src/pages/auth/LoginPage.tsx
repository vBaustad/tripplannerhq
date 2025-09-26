import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { useAuth } from "../../app/providers/AuthProvider";
import s from "./AuthPage.module.css";

type LocationState = { from?: string } | null;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, status } = useAuth();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      await login({ email: email.trim(), password });
      const state = (location.state as LocationState) ?? null;
      navigate(state?.from ?? "/app/billing", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in. Try again.");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.center}>
        <div className={s.card}>
          <header className={s.header}>
            <h1 className={s.title}>Welcome back</h1>
            <p className={s.subtitle}>Pick up where you left off with budgets, packing lists, and reminders.</p>
          </header>

          {error ? <div className={s.error}>{error}</div> : null}

          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label} htmlFor="email">Email</label>
              <input
                id="email"
                className={s.input}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className={s.field}>
              <label className={s.label} htmlFor="password">Password</label>
              <input
                id="password"
                className={s.input}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
              />
            </div>

            <div className={s.actions}>
              <Button variant="primary" size="lg" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <p className={s.altAction}>
            New to TripPlannerHQ? <Link to="/signup" className={s.link}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
