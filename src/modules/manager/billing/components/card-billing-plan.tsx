"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccountClient } from "@/lib/supabase/getUser-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Stripe from "stripe";
import pathsConfig from "../../../../../config/app.router";
import { createClient } from "../../../../../utils/supabase/client";
import {
  BillingInfo,
  BillingPortalCreate,
  CheckoutSession,
} from "../server/api";

export type BillingInfoType = {
  plan: string;
  plandescription: string;
  pricedescription?: string;
  price: string;
  features: Stripe.Product.MarketingFeature[];
  billingCycle: "month" | "year";
  priceId: string;
  priceIdDefault: string;
};

export default function CardBillingPlan({
  billingCycle,
  team,
}: {
  billingCycle: "month" | "year";
  team: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState<string>("");
  const user = useAccountClient();

  const { data: Billing } = useQuery({
    queryKey: ["products-stripe"],
    queryFn: async () => {
      const billing = await BillingInfo();
      return billing;
    },
  });

  const { mutate: createCheckoutSession } = useMutation({
    mutationKey: ["create-checkout-session"],
    mutationFn: async ({
      user_id,
      price,
      mode,
      successurl,
      cancelurl,
    }: {
      user_id: string;
      price: string;
      mode: Stripe.Checkout.SessionCreateParams.Mode;
      successurl: string;
      cancelurl: string;
    }) => {
      // check customer subscription and redirect to portal if active
      const supabase = createClient();
      const { data: subscription } = await supabase
        .from("subscription")
        .select("*")
        .eq("user_owner_subscription_id", user_id)
        .eq("subscription_status", "complete")
        .single();

      if (subscription) {
        if (!subscription.subscription_customer_id)
          throw new Error("No customer id");
        const billingPortal = await BillingPortalCreate(
          subscription.subscription_customer_id,
          `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        );
        return billingPortal;
      } else {
        const checkout = await CheckoutSession(
          user_id,
          price,
          successurl,
          cancelurl,
          mode
        );
        return checkout;
      }
    },
    onSuccess: (data) => {
      setIsPending("");
      router.push(data!);
    },
    onError: () => {
      setIsPending("");
    },
  });

  if (!user.data) return null;

  return (
    <>
      {Billing?.billingInfo
        ?.filter((info) => info.billingCycle === billingCycle)
        .map((info) => (
          <Card key={info.plan} className="w-full p-0">
            <CardContent className="flex flex-row justify-between p-0">
              <div className="flex flex-col space-y-2 flex-1 border-r p-6">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold">{info.plan}</h2>
                  <p className="text-sm text-muted-foreground">
                    {info.plandescription}
                  </p>
                </div>
                <span className="text-4xl font-medium">{info.price}</span>
                <span className="text-sm text-muted-foreground flex-grow">
                  {info.pricedescription}
                </span>
                <Button
                  disabled={
                    isPending === info.priceId ||
                    Billing.userRole === info.plan
                  }
                  onClick={() => {
                    setIsPending(info.priceId);
                    createCheckoutSession({
                      user_id: user.data?.id,
                      price: info.priceId,
                      mode: "subscription",
                      successurl: `${
                        process.env.NEXT_PUBLIC_APP_URL
                      }${pathsConfig.app.workspaceBilling.replace(
                        "[workspace]",
                        team
                      )}/success`,
                      cancelurl: `${
                        process.env.NEXT_PUBLIC_APP_URL
                      }${pathsConfig.app.workspaceBilling.replace(
                        "[workspace]",
                        team
                      )}/cancel`,
                    });
                  }}
                  className="mt-6 cursor-pointer"
                  variant={info.plan === "Free" ? "default" : "outline"}
                >
                  {isPending === info.priceId ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <span>
                      {Billing.userRole === info.plan
                        ? "Current Plan"
                        : "Choose Plan"}
                    </span>
                  )}
                </Button>
              </div>
              <div className="flex-1 p-6">
                <ul>
                  {info.features.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between flex-col w-full gap-4"
                    >
                      {Object.entries(item).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-sm flex items-center gap-2 py-2"
                        >
                          <CheckCircle2Icon className="text-primary" />
                          <span>{value}</span>
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
    </>
  );
}
