import { Clock, MessageCircle, Smartphone } from "lucide-react";
import { todayBookings, type BookingStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "border-success/40 text-success bg-success/10 [box-shadow:0_0_14px_hsl(var(--success)/0.35)]",
  Pending: "border-warning/40 text-warning bg-warning/10 [box-shadow:0_0_14px_hsl(var(--warning)/0.3)]",
  Cancelled: "border-destructive/40 text-destructive bg-destructive/10 [box-shadow:0_0_14px_hsl(var(--destructive)/0.25)]",
};

export const BookingsTimeline = () => {
  return (
    <div className="space-y-2">
      {todayBookings.map((b, i) => (
        <div
          key={b.id}
          className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-3 sm:p-4 transition-all duration-500 hover:border-primary/40 hover:bg-secondary/70 hover:scale-[1.01] animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex flex-col items-center justify-center min-w-[64px] rounded-xl bg-background/60 px-2 py-2 border border-border/60">
            <Clock className="h-3 w-3 text-primary-glow mb-1" />
            <span className="text-xs font-semibold tracking-tight">{b.time}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold truncate">{b.customer}</p>
              <span className={cn("neon-chip text-[10px]", statusStyles[b.status])}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {b.status}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{b.service}</p>
          </div>

          <div className="text-right">
            <p className="font-display font-semibold text-gradient">
              ₹{b.amount.toLocaleString("en-IN")}
            </p>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
              {b.channel === "WhatsApp" ? (
                <MessageCircle className="h-3 w-3" />
              ) : (
                <Smartphone className="h-3 w-3" />
              )}
              {b.channel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
