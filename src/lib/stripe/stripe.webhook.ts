import { CheckoutComplete, CustomerSubscriptionUpdated } from "@/modules/manager/billing/server/api";
import { QueryClient } from "@tanstack/react-query";
import Stripe from "stripe";

export async function stripeWebhook(event: Stripe.Event) {
  const queryClient = new QueryClient();
  switch (event.type) {
    case "price.updated":
      await queryClient.invalidateQueries({ queryKey: ["products-stripe"] });
    case "checkout.session.completed":
        await CheckoutComplete(event as Stripe.CheckoutSessionCompletedEvent);
        break;
    case "customer.subscription.updated":
      await CustomerSubscriptionUpdated(event as Stripe.CustomerSubscriptionUpdatedEvent);
  }
}
