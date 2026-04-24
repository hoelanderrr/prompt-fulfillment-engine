import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { revenueHistory as mockHistory } from "@/lib/mockData";

const fmt = (n: number) =>
  n >= 1000 ? `₹${(n / 1000).toFixed(1)}k` : `₹${n}`;

export const RevenueChart = () => {
  const { user, isReady } = useAuth();
  const { revenueHistory } = useBookings();

  const data = !isReady ? [] : user ? revenueHistory : mockHistory.slice(-30);

  return (
    <div className="h-64 sm:h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
              <stop offset="60%" stopColor="hsl(var(--accent))" stopOpacity={0.18} />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
              <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={fmt}
            width={56}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{
              background: "hsl(250 30% 8% / 0.95)",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 40px hsl(0 0% 0% / 0.6)",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))", fontSize: 12, marginBottom: 4 }}
            itemStyle={{ color: "hsl(var(--primary-glow))", fontWeight: 600 }}
            formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="url(#revStroke)"
            strokeWidth={2.5}
            fill="url(#revFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
