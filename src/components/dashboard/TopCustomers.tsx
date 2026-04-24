import { Crown, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { topCustomers as mockTop } from "@/lib/mockData";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const initials = (name: string) =>
  name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();

const relativeDate = (iso: string) => {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

export const TopCustomers = () => {
  const { user } = useAuth();
  const { topCustomers } = useBookings();

  const list = user
    ? topCustomers.map((c) => ({
        id: c.id,
        name: c.name,
        visits: c.visits,
        spend: c.spend,
        lastVisit: relativeDate(c.lastVisit),
      }))
    : mockTop;

  if (user && list.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed border-border/60 rounded-2xl">
        <p className="font-display text-2xl uppercase italic text-muted-foreground">No patrons yet</p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-2">
          Add bookings to build your top list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((c, i) => {
        const isVip = c.spend >= 10000;
        return (
          <div
            key={c.id}
            className="group flex items-center gap-3 rounded-2xl p-3 border border-border/60 bg-secondary/40 transition-all duration-500 hover:border-accent/50 hover:scale-[1.02] animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-gradient-primary flex items-center justify-center font-display font-semibold text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.5)]">
                {initials(c.name)}
              </div>
              {isVip && (
                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center ring-2 ring-background animate-glow-pulse">
                  <Crown className="h-3 w-3 text-background" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">{c.name}</p>
                {isVip && (
                  <span className="neon-chip text-[10px] border-accent/50 text-accent-glow bg-accent/10">
                    <Sparkles className="h-2.5 w-2.5" /> VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {c.visits} visits · {c.lastVisit}
              </p>
            </div>

            <div className="text-right">
              <p className="font-display font-semibold text-gradient">
                <AnimatedCounter value={c.spend} prefix="₹" duration={1600} />
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">lifetime</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
