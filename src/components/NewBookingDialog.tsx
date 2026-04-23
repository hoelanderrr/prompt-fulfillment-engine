import { useState, FormEvent } from "react";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const services = [
  "Hair Spa", "Color & Highlights", "Manicure", "Facial Glow",
  "Beard Sculpt", "Keratin Treatment", "Massage Therapy", "Bridal Package",
];

export const NewBookingDialog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [service, setService] = useState(services[0]);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next && !user) {
      toast.message("Please sign in to add a booking.");
      navigate("/auth");
      return;
    }
    setOpen(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // demo only — would persist to a `bookings` table in a real build
    await new Promise((r) => setTimeout(r, 600));
    toast.success(`Booked ${customer || "guest"} for ${service} at ${time || "today"}`);
    setCustomer("");
    setTime("");
    setSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          aria-label="New booking"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-4 font-mono text-xs uppercase tracking-wider text-primary-foreground shadow-[0_10px_40px_hsl(var(--primary)/0.55)] hover:scale-105 hover:shadow-[0_10px_60px_hsl(var(--accent)/0.6)] transition-all duration-700 animate-glow-pulse"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-500" />
          <span className="hidden sm:inline">NEW BOOKING</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md glass-card border-border/60">
        <DialogHeader>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">— NEW ENTRY</p>
          <DialogTitle className="font-display text-3xl uppercase tracking-tight">
            ADD A <span className="italic text-gradient">BOOKING</span>
          </DialogTitle>
          <DialogDescription>Quick draft — saves to today's ledger.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">CUSTOMER</label>
            <input
              required
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Aanya Kapoor"
              className="mt-1.5 w-full rounded-xl border border-border bg-input/40 px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SERVICE</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-input/40 px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
              >
                {services.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">TIME</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-input/40 px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-mono uppercase tracking-widest text-primary-foreground shadow-[0_10px_30px_hsl(var(--primary)/0.4)] disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              ADD TO LEDGER
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
