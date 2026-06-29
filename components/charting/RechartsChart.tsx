import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { useMemo } from "react";

interface SeriesDataPoint {
  time: number; // epoch ms
  price: number;
}

export interface RechartsChartProps {
  outcomeOptions: { id: string; label: string; color: string }[];
  outcomeSeries: {
    id: string;
    label: string;
    color: string;
    data: SeriesDataPoint[];
  }[];
  visibleOutcomes: Set<string>;
  onToggleOutcome: (outcomeId: string) => void;
  height?: number;
}

/**
 * Merge multiple series into a single array of points keyed by timestamp.
 * Each point will contain the timestamp and a price field for each series id.
 */
function mergeSeries(series: RechartsChartProps["outcomeSeries"]) {
  const map = new Map<number, Record<string, any>>();
  series.forEach((s) => {
    s.data.forEach((pt) => {
      const entry = map.get(pt.time) || { time: pt.time };
      entry[s.id] = pt.price;
      map.set(pt.time, entry);
    });
  });
  // Convert map to sorted array
  const merged = Array.from(map.values()).sort((a, b) => a.time - b.time);
  return merged;
}

export function RechartsChart({
  outcomeOptions,
  outcomeSeries,
  visibleOutcomes,
  onToggleOutcome,
  height = 500,
}: RechartsChartProps) {
  const mergedData = useMemo(() => mergeSeries(outcomeSeries), [outcomeSeries]);

  const visibleIds = useMemo(() => {
    return new Set(outcomeOptions.filter((o) => visibleOutcomes.has(o.id)).map((o) => o.id));
  }, [outcomeOptions, visibleOutcomes]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={mergedData}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
        <XAxis dataKey="time" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
        <YAxis domain={["dataMin", "dataMax"]} />
        <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />
        <Legend />
        {outcomeSeries.map((s) =>
          visibleIds.has(s.id) ? (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              stroke={s.color}
              dot={false}
              isAnimationActive={false}
            />
          ) : null
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
