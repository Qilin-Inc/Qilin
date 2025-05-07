"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  user: {
    label: "User",
    color: "hsl(var(--chart-1))",
  },
  tournament: {
    label: "Tournament",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function AreaChartGradient({user, tournament}: {user: number, tournament: number}) {
  const chartData = [
    { month: "June", user: 18, tournament: 8 },
    { month: "July", user: 30, tournament: 22 },
    { month: "August", user: 23, tournament: 12 },
    { month: "September", user: 7, tournament: 9 },
    { month: "October", user: 20, tournament: 13 },
    { month: "November", user: 24, tournament: 10 },
    { month: "December", user: 21, tournament: 14 },
    { month: "January", user, tournament },
  ]
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillUser" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-user)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-user)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillTournament" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-tournament)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-tournament)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="tournament"
          type="natural"
          fill="url(#fillTournament)"
          fillOpacity={0.4}
          stroke="var(--color-tournament)"
          stackId="a"
        />
        <Area
          dataKey="user"
          type="natural"
          fill="url(#fillUser)"
          fillOpacity={0.4}
          stroke="var(--color-user)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
