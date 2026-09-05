import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Staff Login — Sunwood Mango Farm" },
      { name: "description", content: "Sign in to the Sunwood Mango Farm admin area to manage orders, products and customer messages." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Staff Login — Sunwood Mango Farm" },
      { property: "og:description", content: "Secure sign-in for the Sunwood Mango Farm team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password })
        : supabase.auth.signUp({
            email: parsed.data.email,
            password: parsed.data.password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await fn;
    if (error) {
      setBusy(false);
      toast.error(error.message);
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setBusy(false);
      toast.success("Account created", { description: "Check your email to confirm, then sign in." });
      setMode("signin");
      return;
    }
    await supabase.rpc("claim_admin");
    setBusy(false);
    navigate({ to: "/admin", replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-secondary/40 px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Sunwood Mango Farm" width={40} height={40} className="size-10" />
          <span className="font-display text-xl font-bold">Sunwood</span>
        </Link>
        <h1 className="mt-6 font-display text-3xl font-bold">
          {mode === "signin" ? "Staff sign in" : "Create staff account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage orders, products and messages.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-leaf-deep disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
      <Toaster position="top-center" richColors />
    </main>
  );
}
