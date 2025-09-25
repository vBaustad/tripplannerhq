import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { useAuth } from "../../app/providers/AuthProvider";
import s from "./AuthPage.module.css";

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, status } = useAuth();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      navigate("/app/billing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  };

  return (
    <div className={s.page}>
      <div className={s.center}>
        <div className={s.card}>
          <header className={s.header}>
            <h1 className={s.title}>Create your account</h1>
            <p className={s.subtitle}>Start planning smarter trips with shared budgets and insights.</p>
          </header>

          {error ? <div className={s.error}>{error}</div> : null}

          <form className={s.form} onSubmit={handleSubmit}>
            <div className={s.field}>
              <label className={s.label} htmlFor="name">Name</label>
              <input
                id="name"
                className={s.input}
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Taylor Traveler"
              />
            </div>

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
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
              />
              <span className={s.hint}>Use at least 8 characters. We keep everything local for now.</span>
            </div>

            <div className={s.actions}>
              <Button variant="primary" size="lg" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>

          <p className={s.altAction}>
            Already have an account? <Link to="/login" className={s.link}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
