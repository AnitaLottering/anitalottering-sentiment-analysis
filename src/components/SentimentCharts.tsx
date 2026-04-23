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
    { name: "😄 Positive", key: "positive", value: counts.positive, color: COLORS.positive },
    { name: "😠 Negative", key: "negative", value: counts.negative, color: COLORS.negative },
    { name: "😐 Neutral", key: "neutral", value: counts.neutral, color: COLORS.neutral },
  ].filter(d => d.value > 0);

  const barData = [
    { name: "😄 Positive", key: "positive", value: +(totals.positive / history.length * 100).toFixed(1), fill: COLORS.positive },
    { name: "😠 Negative", key: "negative", value: +(totals.negative / history.length * 100).toFixed(1), fill: COLORS.negative },
    { name: "😐 Neutral", key: "neutral", value: +(totals.neutral / history.length * 100).toFixed(1), fill: COLORS.neutral },
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
      <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover-lift">
        <h3 className="font-semibold mb-4">Distribution</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <defs>
              <linearGradient id="grad-positive" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={COLORS.positive} stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--quaternary))" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="grad-negative" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={COLORS.negative} stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="grad-neutral" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={COLORS.neutral} stopOpacity={1} />
                <stop offset="100%" stopColor="hsl(var(--tertiary))" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={4}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            >
              {pieData.map((d) => (
                <Cell
                  key={d.key}
                  fill={d.color}
                  stroke="hsl(var(--card))"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover-lift">
        <h3 className="font-semibold mb-4">Average confidence (%)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData}>
            <defs>
              <linearGradient id="bar-positive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.positive} />
                <stop offset="100%" stopColor="hsl(var(--quaternary))" />
              </linearGradient>
              <linearGradient id="bar-negative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.negative} />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
              <linearGradient id="bar-neutral" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.neutral} />
                <stop offset="100%" stopColor="hsl(var(--tertiary))" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(var(--muted) / 0.4)" }} />
            <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
            <Bar
              dataKey="value"
              name="Confidence"
              radius={[8, 8, 0, 0]}
              isAnimationActive
              animationDuration={900}
            >
              {barData.map((d) => (
                <Cell key={d.key} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border shadow-soft hover-lift">
        <h3 className="font-semibold mb-4">Trend (last {trendData.length})</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "0.8rem" }} />
            <Line type="monotone" dataKey="positive" name="😄 Positive" stroke={COLORS.positive} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={900} />
            <Line type="monotone" dataKey="negative" name="😠 Negative" stroke={COLORS.negative} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={900} />
            <Line type="monotone" dataKey="neutral" name="😐 Neutral" stroke={COLORS.neutral} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={900} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
