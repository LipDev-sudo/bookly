"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type MonthlyRevenue = {
  month: string; // "Jan", "Feb", etc.
  revenue: number; // in major currency units
};

export function RevenueChart({ data }: { data: MonthlyRevenue[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No revenue data yet. Complete some appointments to see the chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12 }}
          stroke="hsl(215, 16%, 47%)"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="hsl(215, 16%, 47%)"
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
          }
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(222, 47%, 8%)",
            border: "1px solid hsl(217, 33%, 17%)",
            borderRadius: 8,
            color: "hsl(210, 40%, 98%)",
            fontSize: 13,
          }}
          formatter={(value) => [
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(Number(value)),
            "Revenue",
          ]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(221, 83%, 53%)"
          strokeWidth={2}
          fill="url(#revGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
