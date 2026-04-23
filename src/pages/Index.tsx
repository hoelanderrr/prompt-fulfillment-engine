import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, ArrowDownRight, ArrowRight, Calendar, Crown, Plus,
  Scissors, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { BookingsTimeline } from "@/components/dashboard/BookingsTimeline";
import { TopCustomers } from "@/components/dashboard/TopCustomers";
import { useReveal } from "@/hooks/useReveal";
import {
  revenueToday, revenueWeek, revenueMonth, weekDelta, stats,
} from "@/lib/mockData";

type Range = "Today" | "Week" | "Month";

const Index = () => {
  const [range, setRange] = useState<Range>("Today");
  const [scrollY, setScrollY] = useState(0);
  const rootRef = useReveal();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const value = useMemo(() => {
    if (range === "Today") return revenueToday;
    if (range === "Week") return revenueWeek;
    return revenueMonth;
  }, [range]);

  const positive = weekDelta >= 0;

  const marqueeWords = [
    "Bookings", "Revenue", "Loyalty", "Insights",
    "Reminders", "Reviews", "Inventory", "Payroll",
  ];

  return (
    <div ref={rootRef as React.RefObject<HTMLDivElement>} className="min-h-screen text-foreground overflow-x-hidden">
      {/* Glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{ background: "var(--gradient-glow)" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/55 border-b border-border/50">
        <div className="container flex items-center gap-3 py-4">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center glow-violet">
            <Scissors className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-xl sm:text-2xl leading-none">
              maison <span className="italic text-gradient">lumière</span>
            </h1>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-1.5">
              ledger · bandra west
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#overview" className="reveal-link hover:text-foreground transition-colors">overview</a>
            <a href="#pulse" className="reveal-link hover:text-foreground transition-colors">pulse</a>
            <a href="#bookings" className="reveal-link hover:text-foreground transition-colors">bookings</a>
          </nav>
          <button className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-2 text-xs font-mono uppercase tracking-wider hover:border-primary/50 hover:text-primary-glow transition-all">
            sign in <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </header>

      <main className="space-y-24 sm:space-y-32 pb-32">
        {/* ===== HERO — Editorial ===== */}
        <section id="overview" className="relative pt-12 sm:pt-20">
          {/* Parallax orbs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-40 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />

          <div className="container relative">
            <div className="flex items-center gap-3 mb-8 animate-fade-in">
              <span className="h-px w-10 bg-gradient-primary" />
              <span className="marker-num">001 — the salon, digitised</span>
            </div>

            <h2 className="font-display text-[clamp(2.75rem,9vw,8rem)] leading-[0.95] tracking-tight max-w-5xl animate-fade-up">
              run a salon{" "}
              <span className="italic text-gradient">like a maison</span>,{" "}
              not a spreadsheet.
            </h2>

            <p
              className="mt-8 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed animate-fade-up"
              style={{ animationDelay: "150ms" }}
            >
              one quiet ledger for bookings, revenue and loyalty.
              built for the small businesses that deserve the polish of the big ones.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center gap-4 animate-fade-up"
              style={{ animationDelay: "300ms" }}
            >
              <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_40px_hsl(var(--primary)/0.35)] hover:shadow-[0_10px_60px_hsl(var(--primary)/0.6)] transition-all duration-700">
                open today's ledger
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </button>
              <button className="reveal-link text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
                read the field notes
              </button>
            </div>

            {/* Editorial meta strip */}
            <div
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-border/60 pt-8 animate-fade-up"
              style={{ animationDelay: "450ms" }}
            >
              {[
                { k: "established", v: "mmxxiv" },
                { k: "chairs", v: "12" },
                { k: "stylists", v: "08" },
                { k: "city", v: "mumbai" },
              ].map((m) => (
                <div key={m.k}>
                  <p className="marker-num">{m.k}</p>
                  <p className="font-display text-2xl sm:text-3xl mt-2 italic">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Marquee ===== */}
        <section aria-hidden className="relative border-y border-border/50 bg-background/40 overflow-hidden py-6">
          <div className="flex whitespace-nowrap animate-marquee gap-12 font-display text-3xl sm:text-5xl text-muted-foreground/70">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="flex items-center gap-12">
                <span className={i % 2 ? "italic text-gradient" : ""}>{w}</span>
                <span className="text-primary/60">✦</span>
              </span>
            ))}
          </div>
        </section>

        {/* ===== Revenue hero (counter) ===== */}
        <section id="pulse" className="container">
          <div className="reveal glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-float-slow" style={{ animationDelay: "2s" }} />

            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-primary" />
                  <p className="marker-num">002 — revenue · {range.toLowerCase()}</p>
                </div>
                <div className="font-display text-[clamp(3.5rem,10vw,8rem)] font-normal tracking-tight leading-[0.9]">
                  <AnimatedCounter
                    value={value}
                    prefix="₹"
                    duration={1600}
                    className="text-gradient italic"
                  />
                </div>
                <div className="mt-5 flex items-center gap-3">
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
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    vs previous week
                  </span>
                </div>
              </div>

              {/* Range toggle */}
              <div className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 p-1 backdrop-blur-md self-start lg:self-end">
                {(["Today", "Week", "Month"] as Range[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`relative px-5 py-2 text-sm font-mono uppercase tracking-wider rounded-full transition-all duration-700 ${
                      range === r
                        ? "bg-gradient-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.45)]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== Stat strip ===== */}
        <section className="container">
          <div className="flex items-center gap-3 mb-8 reveal">
            <span className="h-px w-8 bg-accent" />
            <p className="marker-num">003 — at a glance</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "bookings today", value: stats.bookingsToday, icon: Calendar, glow: "primary" },
              { label: "confirmed", value: stats.confirmedToday, icon: Sparkles, glow: "accent" },
              { label: "customers", value: stats.totalCustomers, icon: Users, glow: "primary" },
              { label: "vip members", value: stats.vipCount, icon: Crown, glow: "accent" },
            ].map((s, i) => (
              <div
                key={s.label}
                className="reveal glass-card rounded-2xl p-5 sm:p-6"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="marker-num">{s.label}</p>
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
                <p className="font-display text-4xl sm:text-5xl">
                  <AnimatedCounter value={s.value} duration={1300} />
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Chart + Top Customers ===== */}
        <section className="container grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 reveal glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="marker-num mb-2">004 — revenue pulse</p>
                <h3 className="font-display text-3xl sm:text-4xl italic">last 30 days</h3>
              </div>
              <span className="neon-chip border-primary/40 text-primary-glow bg-primary/10">
                <TrendingUp className="h-3 w-3" /> live
              </span>
            </div>
            <RevenueChart />
          </div>

          <div className="reveal glass-card rounded-3xl p-6 sm:p-8" style={{ transitionDelay: "150ms" }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="marker-num mb-2">005 — patrons</p>
                <h3 className="font-display text-3xl sm:text-4xl italic">top customers</h3>
              </div>
            </div>
            <TopCustomers />
          </div>
        </section>

        {/* ===== Bookings ===== */}
        <section id="bookings" className="container">
          <div className="reveal glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="marker-num mb-2">006 — agenda</p>
                <h3 className="font-display text-3xl sm:text-4xl italic">today's bookings</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {stats.confirmedToday} confirmed · {stats.bookingsToday - stats.confirmedToday} pending review
                </p>
              </div>
              <span className="neon-chip border-accent/40 text-accent-glow bg-accent/10">
                <Calendar className="h-3 w-3" />
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
              </span>
            </div>
            <BookingsTimeline />
          </div>
        </section>

        {/* ===== Closing editorial line ===== */}
        <section className="container">
          <div className="reveal max-w-3xl">
            <p className="marker-num mb-6">— a quiet manifesto</p>
            <p className="font-display text-3xl sm:text-5xl leading-[1.15]">
              software, when done right, should feel like
              <span className="italic text-gradient"> a well-kept ledger</span> —
              measured, beautiful, alive.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/60 backdrop-blur-md">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            © mmxxv · maison lumière
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            crafted in mumbai
          </p>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button
        aria-label="New booking"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-4 font-mono text-xs uppercase tracking-wider text-primary-foreground shadow-[0_10px_40px_hsl(var(--primary)/0.55)] hover:scale-105 hover:shadow-[0_10px_60px_hsl(var(--accent)/0.6)] transition-all duration-700 animate-glow-pulse"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-500" />
        <span className="hidden sm:inline">new booking</span>
      </button>
    </div>
  );
};

export default Index;
