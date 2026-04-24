import { Clock, Trash2, Check, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings, type BookingStatus } from "@/hooks/useBookings";
import { todayBookings as mockToday } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusStyles: Record<BookingStatus, string> = {
  confirmed: "border-success/40 text-success bg-success/10 [box-shadow:0_0_14px_hsl(var(--success)/0.35)]",
  pending: "border-warning/40 text-warning bg-warning/10 [box-shadow:0_0_14px_hsl(var(--warning)/0.3)]",
  cancelled: "border-destructive/40 text-destructive bg-destructive/10 [box-shadow:0_0_14px_hsl(var(--destructive)/0.25)]",
};

const formatTime = (t: string) => {
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
  const ampm = hr >= 12 ? "PM" : "AM";
  const hr12 = hr % 12 || 12;
  return `${String(hr12).padStart(2, "0")}:${m} ${ampm}`;
};

export const BookingsTimeline = () => {
  const { user } = useAuth();
  const { todayBookings, loading, deleteBooking, updateStatus } = useBookings();

  // Signed out: keep the marketing mock view
  if (!user) {
    return (
      <div className="space-y-2">
        {mockToday.map((b, i) => (
          <div
            key={b.id}
            className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-3 sm:p-4 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex flex-col items-center justify-center min-w-[64px] rounded-xl bg-background/60 px-2 py-2 border border-border/60">
              <Clock className="h-3 w-3 text-primary-glow mb-1" />
              <span className="text-xs font-semibold tracking-tight">{b.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{b.customer}</p>
              <p className="text-sm text-muted-foreground truncate">{b.service}</p>
            </div>
            <p className="font-display font-semibold text-gradient">
              ₹{b.amount.toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Loading ledger…
      </div>
    );
  }

  if (todayBookings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl">
        <p className="font-display text-2xl uppercase italic text-muted-foreground">No bookings yet</p>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mt-2">
          Tap "NEW BOOKING" to begin your ledger
        </p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id);
      toast.success("Booking removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const handleToggleStatus = async (id: string, current: BookingStatus) => {
    const next: BookingStatus =
      current === "pending" ? "confirmed" : current === "confirmed" ? "cancelled" : "pending";
    try {
      await updateStatus(id, next);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  return (
    <div className="space-y-2">
      {todayBookings.map((b, i) => (
        <div
          key={b.id}
          className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-secondary/40 p-3 sm:p-4 transition-all duration-500 hover:border-primary/40 hover:bg-secondary/70 animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex flex-col items-center justify-center min-w-[64px] rounded-xl bg-background/60 px-2 py-2 border border-border/60">
            <Clock className="h-3 w-3 text-primary-glow mb-1" />
            <span className="text-xs font-semibold tracking-tight">{formatTime(b.booking_time)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold truncate">{b.customer_name}</p>
              <button
                onClick={() => handleToggleStatus(b.id, b.status)}
                className={cn("neon-chip text-[10px] capitalize cursor-pointer", statusStyles[b.status])}
                title="Click to change status"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                {b.status}
              </button>
            </div>
            <p className="text-sm text-muted-foreground truncate">{b.service}</p>
          </div>

          <div className="text-right">
            <p className="font-display font-semibold text-gradient">
              ₹{Number(b.price).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {b.status !== "confirmed" && (
              <button
                onClick={() => updateStatus(b.id, "confirmed")}
                className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-colors"
                title="Confirm"
              >
                <Check className="h-4 w-4" />
              </button>
            )}
            {b.status === "cancelled" && (
              <button
                onClick={() => updateStatus(b.id, "pending")}
                className="p-1.5 rounded-lg text-warning hover:bg-warning/10 transition-colors"
                title="Restore"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => handleDelete(b.id)}
              className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
