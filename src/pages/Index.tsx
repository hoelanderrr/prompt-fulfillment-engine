import { useMemo, useState } from "react";
import {
  ArrowUpRight, ArrowDownRight, Calendar, Crown, Plus,
  Scissors, Search, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingsTimeline } from "@/components/dashboard/BookingsTimeline";
import { TopCustomers } from "@/components/dashboard/TopCustomers";
import {
  revenueToday, revenueWeek, revenueMonth, weekDelta, stats,
} from "@/lib/mockData";

type Range = "Today" | "Week" | "Month";

const Index = () => {
  const [range, setRange] = useState<Range>("Today");

  const value = useMemo(() => {
    if (range === "Today") return revenueToday;
    if (range === "Week") return revenueWeek;
    return revenueMonth;
  }, [range]);

  const positive = weekDelta >= 0;

  return (
    <div className="min-h-screen text-foreground">
      {/* Glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-80"
        style={{ background: "var(--gradient-glow)" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-border/60">
        <div className="container flex items-center gap-3 py-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-violet">
            <Scissors className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-lg sm:text-xl font-bold leading-none">
              Maison <span className="text-gradient">Lumière</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Salon · Bandra West, Mumbai</p>
          </div>
          <button
            aria-label="Search"
            className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-secondary/40 hover:border-primary/50 transition-all"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      <main className="container py-6 sm:py-10 space-y-6 sm:space-y-8 pb-32">
        {/* Hero — Revenue counter */}
        <section className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden animate-fade-up">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Revenue · {range}
              </p>
              <div className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-none">
                <AnimatedCounter
                  value={value}
                  prefix="₹"
                  duration={1500}
                  className="text-gradient"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`neon-chip ${
                    positive
                      ? "border-success/40 text-success bg-success/10"
                      : "border-destructive/40 text-destructive bg-destructive/10"
                  }`}
                >
                  {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(weekDelta).toFixed(1)}% wow
                </span>
                <span className="text-xs text-muted-foreground">vs previous week</span>
              </div>
            </div>

            {/* Range toggle */}
            <div className="inline-flex items-center gap-1 rounded-2xl border border-border/60 bg-background/60 p-1 backdrop-blur-md self-start">
              {(["Today", "Week", "Month"] as Range[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-500 ${
                    range === r
                      ? "bg-gradient-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Stat strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Bookings Today", value: stats.bookingsToday, icon: Calendar, glow: "primary" },
            { label: "Confirmed", value: stats.confirmedToday, icon: Sparkles, glow: "accent" },
            { label: "Customers", value: stats.totalCustomers, icon: Users, glow: "primary" },
            { label: "VIP Members", value: stats.vipCount, icon: Crown, glow: "accent" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="glass-card rounded-2xl p-4 sm:p-5 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    s.glow === "primary"
                      ? "bg-primary/15 text-primary-glow"
                      : "bg-accent/15 text-accent-glow"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="font-display text-3xl font-bold">
                <AnimatedCounter value={s.value} duration={1200} />
              </p>
            </div>
          ))}
        </section>

        {/* Chart + Top Customers */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card rounded-3xl p-5 sm:p-6 animate-fade-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold">Revenue Pulse</h2>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days · ₹ Indian Rupees</p>
              </div>
              <span className="neon-chip border-primary/40 text-primary-glow bg-primary/10">
                <TrendingUp className="h-3 w-3" /> Live
              </span>
            </div>
            <RevenueChart />
          </div>

          <div className="glass-card rounded-3xl p-5 sm:p-6 animate-fade-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-semibold">Top Customers</h2>
                <p className="text-xs text-muted-foreground mt-1">Ranked by lifetime spend</p>
              </div>
            </div>
            <TopCustomers />
          </div>
        </section>

        {/* Bookings timeline */}
        <section className="glass-card rounded-3xl p-5 sm:p-6 animate-fade-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold">Today's Bookings</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.confirmedToday} confirmed · {stats.bookingsToday - stats.confirmedToday} pending review
              </p>
            </div>
            <span className="neon-chip border-accent/40 text-accent-glow bg-accent/10">
              <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
            </span>
          </div>
          <BookingsTimeline />
        </section>
      </main>

      {/* Floating Action Button */}
      <button
        aria-label="New booking"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-4 font-semibold text-primary-foreground shadow-[0_10px_40px_hsl(var(--primary)/0.6)] hover:scale-105 hover:shadow-[0_10px_60px_hsl(var(--accent)/0.7)] transition-all duration-500 animate-glow-pulse"
      >
        <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-500" />
        <span className="hidden sm:inline">New Booking</span>
      </button>
    </div>
  );
};

export default Index;
