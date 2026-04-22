import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import type { HistoryEntry } from "@/lib/storage";

const COLORS = {
  positive: "hsl(var(--positive))",
  negative: "hsl(var(--negative))",
  neutral: "hsl(var(--neutral))",
};

export const SentimentCharts = ({ history }: { history: HistoryEntry[] }) => {
  if (history.length === 0) return null;

  const totals = history.reduce(
    (acc, h) => {
      acc.positive += h.result.positive;
      acc.negative += h.result.negative;
      acc.neutral += h.result.neutral;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  const counts = history.reduce(
    (acc, h) => {
      acc[h.result.label]++;
      return acc;
    },
    { positive: 0, negative: 0, neutral: 0 }
  );

  const pieData = [
    { name: "Positive", value: counts.positive, color: COLORS.positive },
    { name: "Negative", value: counts.negative, color: COLORS.negative },
    { name: "Neutral", value: counts.neutral, color: COLORS.neutral },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "Positive", value: +(totals.positive / history.length * 100).toFixed(1), fill: COLORS.positive },
    { name: "Negative", value: +(totals.negative / history.length * 100).toFixed(1), fill: COLORS.negative },
    { name: "Neutral", value: +(totals.neutral / history.length * 100).toFixed(1), fill: COLORS.neutral },
  ];

  const trendData = [...history].reverse().slice(-20).map((h, i) => ({
    name: `#${i + 1}`,
    positive: +(h.result.positive * 100).toFixed(1),
    negative: +(h.result.negative * 100).toFixed(1),
    neutral: +(h.result.neutral * 100).toFixed(1),
  }));

  const tooltipStyle = {
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem",
    fontSize: "0.85rem",
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
        <h3 className="font-semibold mb-4">Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={85} paddingAngle={4}>
              {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
        <h3 className="font-semibold mb-4">Average confidence (%)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
        <h3 className="font-semibold mb-4">Trend (last {trendData.length})</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="positive" stroke={COLORS.positive} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="negative" stroke={COLORS.negative} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="neutral" stroke={COLORS.neutral} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
