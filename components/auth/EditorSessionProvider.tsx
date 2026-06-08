"use client";

import { SessionProvider } from "next-auth/react";

export function EditorSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider basePath="/api/editor-auth">{children}</SessionProvider>;
}
