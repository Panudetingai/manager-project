"use server";

import { fucngetProducts } from "@/lib/stripe/func/func-product-format";
import { CreateServiceStripe } from "@/lib/stripe/stripe.service";
import Stripe from "stripe";
import { createClient } from "../../../../../utils/supabase/server";

export async function getProducts() {
  const stripe = CreateServiceStripe();
  return await stripe.getProducts();
}

export async function BillingInfo() {
  const products = await getProducts();

  const billingInfo = await fucngetProducts({
    products,
  });
  return billingInfo;
}

export async function CheckoutSession(
  user_id: string,
  priceId: string,
  success_url: string,
  cancel_url: string,
  mode: Stripe.Checkout.SessionCreateParams.Mode
) {
  const stripe = CreateServiceStripe();
  const checkout = await stripe.createCheckoutSession(
    user_id,
    priceId,
    success_url,
    cancel_url,
    mode
  );

  return checkout.url;
}

export async function CheckoutComplete(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  const data = event.data.object;
  const supabase = await createClient();
  const stripe = CreateServiceStripe();
  const userCheckout = await stripe.retrieveCheckoutSession(data.id);
  const productsRole = await stripe.getProduct(
    userCheckout.data.map((Item) => (Item && Item.price?.product as string)).join(",") ||
      ""
  );

  // You can handle post-checkout logic here, such as updating your database

  const { data: subscriptionData, error } = await supabase.rpc(
    "insert_subscription",
    {
      s_id: data.id,
      s_sub_id: data.subscription as string,
      s_cus_id: data.customer as string,
      s_inv_id: data.invoice as string,
      s_status: data.status as string,
      s_created_at: new Date(data.created * 1000).toISOString(),
      s_expires_at: new Date((data.expires_at ?? 0) * 1000).toISOString(),
      s_updated_at: new Date().toISOString(),
      s_user_id: data.metadata?.user_id as string,

      l_item_id:
        userCheckout.data.map((Item) => Item.id).join(",") || "Not Item ID",
      l_item_price_id:
        userCheckout.data.map((Item) => Item.price?.id).join(",") ||
        "Not Price ID",
      l_item_product_id:
        userCheckout.data.map((Item) => Item.price?.product).join(",") ||
        "Not Product ID",
      l_item_productname:
        userCheckout.data.map((Item) => Item.description).join(",") ||
        "Not Product Name",
      l_item_created_at: new Date().toISOString(),
      l_item_updated_at: new Date().toISOString(),
    }
  );

  if (error) return console.error("Error inserting subscription:", error);

  const {error: roleupdate} = await supabase.from("subscription_user_role").upsert({
    user_owner_id: data.metadata?.user_id as string,
    user_role: (productsRole.metadata?.plan === "Premium" || productsRole.metadata?.plan === "Pro")
      ? productsRole.metadata?.plan
      : undefined
  });

  if (roleupdate) console.error("Error updating user role:", roleupdate);

  return subscriptionData;
}
