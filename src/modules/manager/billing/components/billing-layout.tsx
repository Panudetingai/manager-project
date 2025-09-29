"use client";

import { Card, CardContent } from "@/components/ui/card";

type BillingInfoType = {
  plan: string;
  plandescription: string;
  pricedescription?: string;
  price: string;
  items: Record<string, string>[];
};

const BillingInfo: BillingInfoType[] = [
  {
    plan: "Free",
    plandescription: "For personal use and small teams.",
    price: "$0",
    pricedescription: "per month",
    items: [{ Projects: "3" }, { Storage: "1 GB" }, { Users: "2" }],
  },
];

export default function BillingLayout() {
  return (
    <div className="flex flex-col w-full h-full">
      <h1 className="text-lg font-medium">Subscription Plan</h1>
      <div className="flex items-center w-full">{BillingInfo.map((info) => (
        <Card key={info.plan} className="p-2">
            <CardContent>
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-semibold">{info.plan}</h2>
                    <p>{info.plandescription}</p>
                    <span>{info.price}</span>
                    <span className="text-sm text-muted-foreground">{info.pricedescription}</span>
                </div>
            </CardContent>
        </Card>
      ))}</div>
    </div>
  );
}
