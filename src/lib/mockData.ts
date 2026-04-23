// Mock data for Local Business Digitizer dashboard
export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";

export interface Booking {
  id: string;
  customer: string;
  service: string;
  time: string;
  status: BookingStatus;
  amount: number;
  channel: "SMS" | "WhatsApp";
}

export interface Customer {
  id: string;
  name: string;
  visits: number;
  spend: number;
  lastVisit: string;
}

export interface RevenuePoint {
  day: string;
  revenue: number;
}

const services = [
  "Hair Spa", "Color & Highlights", "Manicure", "Facial Glow",
  "Beard Sculpt", "Keratin Treatment", "Massage Therapy", "Bridal Package",
];

const names = [
  "Aanya Kapoor", "Rohan Mehta", "Isha Sharma", "Vikram Singh",
  "Priya Nair", "Arjun Reddy", "Sneha Iyer", "Kabir Khanna",
  "Meera Joshi", "Yash Patel", "Diya Bose", "Aarav Malhotra",
  "Kavya Rao", "Neel Gupta", "Tara Bhatia", "Dev Saxena",
  "Riya Choudhury", "Aditya Verma", "Sara Ali", "Karan Bedi",
  "Ananya Pillai", "Vivaan Khurana",
];

export const todayBookings: Booking[] = [
  { id: "b1", customer: "Aanya Kapoor",   service: "Color & Highlights", time: "10:00 AM", status: "Confirmed", amount: 4500, channel: "WhatsApp" },
  { id: "b2", customer: "Rohan Mehta",    service: "Beard Sculpt",       time: "11:30 AM", status: "Confirmed", amount: 800,  channel: "SMS" },
  { id: "b3", customer: "Isha Sharma",    service: "Bridal Package",     time: "12:30 PM", status: "Pending",   amount: 18000,channel: "WhatsApp" },
  { id: "b4", customer: "Vikram Singh",   service: "Massage Therapy",    time: "02:00 PM", status: "Confirmed", amount: 2200, channel: "WhatsApp" },
  { id: "b5", customer: "Priya Nair",     service: "Facial Glow",        time: "03:30 PM", status: "Cancelled", amount: 1800, channel: "SMS" },
  { id: "b6", customer: "Arjun Reddy",    service: "Keratin Treatment",  time: "05:00 PM", status: "Confirmed", amount: 6500, channel: "WhatsApp" },
  { id: "b7", customer: "Sneha Iyer",     service: "Manicure",           time: "06:30 PM", status: "Pending",   amount: 1200, channel: "WhatsApp" },
];

// Top customers (ranked by spend) — 2 VIPs above ₹10,000
export const topCustomers: Customer[] = [
  { id: "c1", name: "Isha Sharma",  visits: 14, spend: 42500, lastVisit: "Today" },
  { id: "c2", name: "Aanya Kapoor", visits: 19, spend: 28900, lastVisit: "Today" },
  { id: "c3", name: "Meera Joshi",  visits: 11, spend: 9800,  lastVisit: "Yesterday" },
  { id: "c4", name: "Kabir Khanna", visits: 9,  spend: 8400,  lastVisit: "2 days ago" },
  { id: "c5", name: "Diya Bose",    visits: 7,  spend: 6200,  lastVisit: "3 days ago" },
];

// Generate 60 days of revenue (₹800 – ₹18,000)
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const revenueHistory: RevenuePoint[] = Array.from({ length: 60 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (59 - i));
  const base = 800 + seeded(i) * 17200;
  // weekend bump
  const weekendMult = [0, 6].includes(date.getDay()) ? 1.4 : 1;
  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    revenue: Math.round(base * weekendMult),
  };
});

export const revenueToday = todayBookings
  .filter(b => b.status !== "Cancelled")
  .reduce((s, b) => s + b.amount, 0);

export const revenueWeek = revenueHistory.slice(-7).reduce((s, d) => s + d.revenue, 0);
export const revenueMonth = revenueHistory.slice(-30).reduce((s, d) => s + d.revenue, 0);

const prevWeek = revenueHistory.slice(-14, -7).reduce((s, d) => s + d.revenue, 0);
export const weekDelta = ((revenueWeek - prevWeek) / prevWeek) * 100;

export const stats = {
  totalCustomers: names.length,
  vipCount: topCustomers.filter(c => c.spend >= 10000).length,
  bookingsToday: todayBookings.length,
  confirmedToday: todayBookings.filter(b => b.status === "Confirmed").length,
};
