"use client";

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/animate/tabs";
import { useState } from "react";
import CardBillingPlan from "./card-billing-plan";

export default function BillingLayout({ team }: { team: string }) {
  const [billingCycle, setBillingCycle] = useState<"month" | "year">(
    "month"
  );

  return (
    <div className="flex flex-col w-full h-full">
      <Tabs
        value={billingCycle}
        onValueChange={(value: string) =>
          setBillingCycle(value as "month" | "year")
        }
      >
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium">Subscription Plan</h1>
          <TabsList>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="year">Yearly</TabsTrigger>
          </TabsList>
        </div>
        <TabsContents>
          <TabsContent value={billingCycle} className="w-full">
            <div className="flex items-center w-full flex-col space-y-4 mt-4">
              <CardBillingPlan billingCycle={billingCycle} team={team} />
            </div>
          </TabsContent>
        </TabsContents>
      </Tabs>
    </div>
  );
}
