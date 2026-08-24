import { notFound } from "next/navigation";

// Everything under /dev is a personal development tool for iterating on
// screen designs — never linked from the real app, and hidden entirely in
// production builds (404s there instead of shipping as a public route).
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <>{children}</>;
}
