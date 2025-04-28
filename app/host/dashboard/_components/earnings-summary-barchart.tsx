"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface EarningsSummaryData {
  month: string;
  amount: number;
}

interface EarningsSummaryBarChartProps {
  data: EarningsSummaryData[];
}

const chartConfig = {
  desktop: {
    label: "amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function EarningsSummaryBarChart({
  data,
}: EarningsSummaryBarChartProps) {
  // Format the currency and month for the tooltip
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`;
  const formatMonth = (month: string) =>
    new Date(month).toLocaleDateString("en-GB", {
      month: "long",
    });

  return (
    <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
      <ResponsiveContainer width="100%">
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{
            left: 20,
            right: 32,
            top: 16,
            bottom: 0,
          }}
        >
          <XAxis
            type="number"
            tickFormatter={formatCurrency}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="month"
            type="category"
            tickFormatter={formatMonth}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="amount"
            fill="var(--color-desktop)"
            radius={[4, 4, 0, 0]}
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
