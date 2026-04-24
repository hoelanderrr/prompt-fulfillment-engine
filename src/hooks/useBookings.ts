import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface BookingRow {
  id: string;
  user_id: string;
  customer_name: string;
  service: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:MM:SS
  price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useBookings = () => {
  const { user, isReady } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: true });
    if (!error && data) setBookings(data as BookingRow[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    fetchBookings();
  }, [isReady, fetchBookings]);

  // Realtime subscription for current user
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`bookings:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings", filter: `user_id=eq.${user.id}` },
        () => fetchBookings()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchBookings]);

  const addBooking = async (input: {
    customer_name: string;
    service: string;
    booking_date: string;
    booking_time: string;
    price: number;
    status: BookingStatus;
    notes?: string;
  }) => {
    if (!user) throw new Error("Not signed in");
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      customer_name: input.customer_name,
      service: input.service,
      booking_date: input.booking_date,
      booking_time: input.booking_time,
      price: input.price,
      status: input.status,
      notes: input.notes ?? null,
    });
    if (error) throw error;
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) throw error;
  };

  const updateStatus = async (id: string, status: BookingStatus) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) throw error;
  };

  // Derived stats
  const today = new Date().toISOString().slice(0, 10);
  const todayBookings = bookings.filter((b) => b.booking_date === today);
  const todayActive = todayBookings.filter((b) => b.status !== "cancelled");

  const revenueToday = todayActive.reduce((s, b) => s + Number(b.price), 0);

  const startOfWeek = (() => {
    const d = new Date();
    const diff = d.getDay() === 0 ? 6 : d.getDay() - 1;
    d.setDate(d.getDate() - diff);
    return d.toISOString().slice(0, 10);
  })();
  const startOfMonth = (() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  })();
  const startOfPrevWeek = (() => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  })();

  const sumBetween = (from: string, toExclusive?: string) =>
    bookings
      .filter(
        (b) =>
          b.status !== "cancelled" &&
          b.booking_date >= from &&
          (!toExclusive || b.booking_date < toExclusive)
      )
      .reduce((s, b) => s + Number(b.price), 0);

  const revenueWeek = sumBetween(startOfWeek);
  const revenueMonth = sumBetween(startOfMonth);
  const revenuePrevWeek = sumBetween(startOfPrevWeek, startOfWeek);
  const weekDelta =
    revenuePrevWeek > 0 ? ((revenueWeek - revenuePrevWeek) / revenuePrevWeek) * 100 : 0;

  // Unique customers
  const customerNames = new Set(bookings.map((b) => b.customer_name.trim().toLowerCase()));
  const totalCustomers = customerNames.size;

  // Top customers by lifetime spend
  const topCustomers = (() => {
    const map = new Map<
      string,
      { name: string; spend: number; visits: number; lastVisit: string }
    >();
    for (const b of bookings) {
      if (b.status === "cancelled") continue;
      const key = b.customer_name.trim().toLowerCase();
      const prev = map.get(key);
      if (prev) {
        prev.spend += Number(b.price);
        prev.visits += 1;
        if (b.booking_date > prev.lastVisit) prev.lastVisit = b.booking_date;
      } else {
        map.set(key, {
          name: b.customer_name,
          spend: Number(b.price),
          visits: 1,
          lastVisit: b.booking_date,
        });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5)
      .map((c, i) => ({ id: `c${i}`, ...c }));
  })();

  const vipCount = topCustomers.filter((c) => c.spend >= 10000).length;

  // 30-day revenue history
  const revenueHistory = (() => {
    const points: { day: string; revenue: number; date: string }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const revenue = bookings
        .filter((b) => b.status !== "cancelled" && b.booking_date === dateStr)
        .reduce((s, b) => s + Number(b.price), 0);
      points.push({
        date: dateStr,
        day: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        revenue,
      });
    }
    return points;
  })();

  return {
    bookings,
    todayBookings,
    loading,
    addBooking,
    deleteBooking,
    updateStatus,
    refetch: fetchBookings,
    stats: {
      bookingsToday: todayBookings.length,
      confirmedToday: todayBookings.filter((b) => b.status === "confirmed").length,
      totalCustomers,
      vipCount,
    },
    revenueToday,
    revenueWeek,
    revenueMonth,
    weekDelta,
    topCustomers,
    revenueHistory,
  };
};
