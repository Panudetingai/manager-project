"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { createClient } from "../../../../utils/supabase/client";
import { Database } from "../../../../utils/supabase/database.types";
import LoaderTable from "./option/loader-table";
import TableListUser from "./table-list-user";

const chartconfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function getDaysRange(from: Date, to: Date) {
  const arr = [];
  const start = new Date(from);
  const end = new Date(to);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

function getLastNDays(days: number) {
  const arr = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    arr.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
  }
  return arr;
}

export default function Cardlistuser() {
  const supabase = createClient();
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  const { data: userlist, isPending } = useQuery<{
    chartdata: { date: string; count: number }[];
    userlist: Database["public"]["Tables"]["account"]["Row"][];
  }>({
    queryKey: [
      "users",
      range?.from?.toISOString() ?? "",
      range?.to?.toISOString() ?? "",
    ],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("account")
        .select("*")
        .gte(
          "created_at",
          range?.from
            ? range.from.toISOString()
            : new Date(
                new Date().setDate(new Date().getDate() - 7)
              ).toISOString()
        )
        .lte(
          "created_at",
          range?.to ? range.to.toISOString() : new Date().toISOString()
        )
        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error fetching users:", error);
      }

      if (!data)
        return {
          chartdata: [],
          userlist: [],
        };

      const daysArr =
        range?.from && range?.to
          ? getDaysRange(range.from, range.to)
          : getLastNDays(7);

      const result = daysArr.map((date) => ({
        date,
        count: data.filter(
          (item) => item.created_at && item.created_at.slice(0, 10) === date
        ).length,
      }));

      return {
        chartdata: result,
        userlist: data,
      };
    },
  });

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-center space-x-2 w-full justify-between">
          <CardTitle className="">User List</CardTitle>
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"}>
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {range?.from
                    ? range.from.toLocaleDateString()
                    : "Start"} -{" "}
                  {range?.to ? range.to.toLocaleDateString() : "End"}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode={"range"}
                  selected={range}
                  onSelect={(v) => setRange(v as DateRange)}
                  required={false}
                  fixedWeeks={true}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <CardDescription>
          A list of users registered in the last{" "}
          {Math.ceil(
            ((range?.to?.getTime() ?? Date.now()) -
              (range?.from?.getTime() ??
                Date.now() - 7 * 24 * 60 * 60 * 1000)) /
              (1000 * 60 * 60 * 24)
          )}{" "}
          days.
        </CardDescription>
        <div className="w-full">
          <ChartContainer config={chartconfig} className="h-32 w-full">
            <AreaChart
              accessibilityLayer
              data={userlist?.chartdata ?? []}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3" />
              <XAxis
                dataKey={"date"}
                tickLine={true}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey={"count"}
                type={"monotone"}
                fill="var(--color-chart-1)"
                fillOpacity={0.3}
                dot={{
                  r: 3,
                  strokeWidth: 2,
                  fill: "var(--color-background)",
                  stroke: "var(--color-chart-1)",
                }}
                stroke="var(--color-chart-1)"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <LoaderTable />
        ) : (
          <TableListUser userlist={userlist?.userlist.slice(0, 5)} />
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          href="#"
          className="text-sm font-medium hover:underline text-primary"
        >
          View All
        </Link>
      </CardFooter>
    </Card>
  );
}
