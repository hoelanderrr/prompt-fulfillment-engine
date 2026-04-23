import { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { user, isReady } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = mode === "signin" ? "Sign in · Maison Lumière" : "Create account · Maison Lumière";
  }, [mode]);

  useEffect(() => {
    if (isReady && user) navigate("/", { replace: true });
  }, [isReady, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate("/", { replace: true });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're in.");
        navigate("/", { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{ background: "var(--gradient-glow)" }}
      />

      <header className="container py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> BACK
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Scissors className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg uppercase tracking-tight">MAISON <span className="italic text-gradient">LUMIÈRE</span></span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 animate-fade-up">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            — {mode === "signin" ? "WELCOME BACK" : "JOIN THE LEDGER"}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight leading-tight mb-8">
            {mode === "signin" ? (
              <>SIGN <span className="italic text-gradient">IN</span></>
            ) : (
              <>CREATE <span className="italic text-gradient">ACCOUNT</span></>
            )}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">DISPLAY NAME</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1.5 w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
            )}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="mt-1.5 w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">PASSWORD</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-border bg-input/40 px-4 py-3 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-mono uppercase tracking-widest text-primary-foreground shadow-[0_10px_40px_hsl(var(--primary)/0.35)] hover:shadow-[0_10px_60px_hsl(var(--primary)/0.6)] transition-all duration-700 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                NEW HERE?{" "}
                <button onClick={() => setMode("signup")} className="reveal-link text-foreground uppercase tracking-wider font-mono text-xs">
                  CREATE ACCOUNT
                </button>
              </>
            ) : (
              <>
                ALREADY HAVE AN ACCOUNT?{" "}
                <button onClick={() => setMode("signin")} className="reveal-link text-foreground uppercase tracking-wider font-mono text-xs">
                  SIGN IN
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
