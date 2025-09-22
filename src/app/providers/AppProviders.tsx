// src/app/providers/AppProviders.tsx
import React from "react";

type Props = { children?: React.ReactNode };

export function AppProviders({ children }: Props) {
  return <>{children}</>;
}
