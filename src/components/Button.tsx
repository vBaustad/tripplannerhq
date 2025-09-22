import { Link } from "react-router-dom";
import s from "./Button.module.css";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  to?: string; // if present, renders a <Link>
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  to,
  className,
  ...rest
}: ButtonProps) {
  const cls = [s.btn, s[variant], s[size], className].filter(Boolean).join(" ");

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} type="button" {...rest}>
      {children}
    </button>
  );
}
