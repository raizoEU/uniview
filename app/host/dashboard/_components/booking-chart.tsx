"use client";

import * as React from "react";
import { PieChart, Pie, Label } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BookingChartProps {
  pendingBookings: number;
  confirmedBookings: number;
}

const chartConfig = {
  bookings: {
    label: "Bookings",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BookingChart({
  pendingBookings,
  confirmedBookings,
}: BookingChartProps) {
  const chartData = [
    {
      status: "pending",
      bookings: pendingBookings,
      fill: "hsl(var(--chart-1))",
    },
    {
      status: "confirmed",
      bookings: confirmedBookings,
      fill: "hsl(var(--chart-2))",
    },
  ];

  const totalBookings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.bookings, 0);
  }, [chartData]);

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square max-h-[250px] mx-auto"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="bookings"
          nameKey="status"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <BookingChartLabel
                    viewBox={viewBox}
                    totalBookings={totalBookings}
                  />
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

interface BookingChartLabelProps {
  viewBox: any;
  totalBookings: number;
}

function BookingChartLabel({ viewBox, totalBookings }: BookingChartLabelProps) {
  return (
    <text
      x={viewBox.cx}
      y={viewBox.cy}
      textAnchor="middle"
      dominantBaseline="middle"
    >
      <tspan
        x={viewBox.cx}
        y={viewBox.cy}
        className="fill-foreground text-3xl font-bold"
      >
        {totalBookings.toLocaleString()}
      </tspan>
      <tspan
        x={viewBox.cx}
        y={viewBox.cy + 24}
        className="fill-muted-foreground"
      >
        Total Bookings
      </tspan>
    </text>
  );
}
