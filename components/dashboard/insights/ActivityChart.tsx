"use client";

import type { ChartDataPoint } from "@/lib/analytics";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

type ActivityChartProps = {
  data: ChartDataPoint[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type ActivityTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: ValueType }>;
  label?: string | number;
};

function ActivityTooltip({ active, payload, label }: ActivityTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-[#101a27]/95 p-3 shadow-2xl backdrop-blur-xl">
      <p className="mb-2 text-sm font-semibold text-white">{formatDate(String(label))}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-white/75">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          Views <span className="font-semibold text-white">{payload[0]?.value ?? 0}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/75">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          Clicks <span className="font-semibold text-white">{payload[1]?.value ?? 0}</span>
        </div>
      </div>
    </div>
  );
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="h-[210px] w-full sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#ffffff35"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            minTickGap={12}
            dy={8}
          />
          <YAxis
            stroke="#ffffff30"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            width={34}
          />
          <Tooltip content={<ActivityTooltip />} cursor={{ stroke: "#ffffff22" }} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#3b82f6"
            strokeWidth={2.25}
            fill="url(#viewsGradient)"
            fillOpacity={0.7}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#a855f7"
            strokeWidth={2.25}
            fill="url(#clicksGradient)"
            fillOpacity={0.65}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
