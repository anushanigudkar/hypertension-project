import { notFound } from "next/navigation";

// Everything under /dev is a personal development tool for iterating on
// screen designs — never linked from the real app, and hidden by default.
// Gated on an explicit opt-in env var rather than NODE_ENV, so it can be
// deliberately enabled on a specific deployment (e.g. for sharing a
// preview link) without being wide open on every production build.
export default function DevLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_ROUTES !== "true") {
    notFound();
  }

  return <>{children}</>;
}
