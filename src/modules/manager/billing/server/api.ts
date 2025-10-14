"use server";

import { fucngetProducts } from "@/lib/stripe/func/func-product-format";
import { CreateServiceStripe } from "@/lib/stripe/stripe.service";
import { getUserServer } from "@/lib/supabase/getUser-server";
import Stripe from "stripe";
import { createClient } from "../../../../../utils/supabase/server";

// Fetch products and prices from Stripe
export async function getProducts() {
  const stripe = CreateServiceStripe();
  return await stripe.getProducts();
}

// Fetch billing information
export async function BillingInfo() {
  const products = await getProducts();
  const supabase = await createClient();
  const user = await getUserServer();

  const { data, error } = await supabase
    .from("subscription_user_role")
    .select("user_role, Interval")
    .eq("user_owner_id", user && user.id ? user.id : "none")
    .single();

  if (error) console.error("Error fetching billing information:", error);

  const billingInfo = await fucngetProducts({
    products,
  });
  if (!data) {
    return {
      billingInfo,
      userRole: "Free",
    };
  }
  return {
    billingInfo,
    userRole: `${data.user_role} (${data.Interval})` || "Free",
  };
}

// Create a checkout session
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

// Webhook to handle post-checkout actions
export async function CheckoutComplete(
  event: Stripe.CheckoutSessionCompletedEvent
) {
  const data = event.data.object;
  const supabase = await createClient();
  const stripe = CreateServiceStripe();
  const userCheckout = await stripe.retrieveCheckoutSession(data.id);
  const productsRole = await stripe.getProduct(
    userCheckout.data
      .map((Item) => Item && (Item.price?.product as string))
      .join(",") || ""
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

  const { error: roleupdate } = await supabase
    .from("subscription_user_role")
    .insert({
      user_owner_id: data.metadata?.user_id as string,
      user_role:
        productsRole.metadata?.plan === "Premium" ||
        productsRole.metadata?.plan === "Pro"
          ? productsRole.metadata?.plan
          : undefined,
      Interval: productsRole.name.match(/\(([^)]+)\)/)?.[1] || "Not Specified",
      cus_id: data.customer as string,
    });

  if (roleupdate) console.error("Error updating user role:", roleupdate);

  return subscriptionData;
}

// Create a billing portal session
export async function BillingPortalCreate(
  customerId: string,
  returnUrl: string
) {
  const stripe = CreateServiceStripe();
  const portal = await stripe.BillingPortalSession(customerId, returnUrl);
  return portal.url;
}

// customer updated webhook to refresh billing info
export async function CustomerUpdated(event: Stripe.CustomerUpdatedEvent) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription")
    .update({
      created_at: new Date(event.data.object.created * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("subscription_customer_id", event.data.object.id);

  if (error) console.error("Error updating customer:", error);
  return data;
}

// customer updated webhook to refresh billing info suscription update
export async function CustomerSubscriptionUpdated(
  event: Stripe.CustomerSubscriptionUpdatedEvent
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription")
    .update({
      created_at: new Date(
        Number(event.data.object.created) * 1000
      ).toISOString(),
      expires_at: new Date(
        (Number(event.data.object.ended_at) ?? 0) * 1000
      ).toISOString(),
      subscription_invoice_id: event.data.object.latest_invoice as string,
    })
    .eq("subscription_id", event.data.object.id as string)
    .select()
    .single();
  if (error) console.error("Error updating subscription:", error);
  if (!data) return;

  const { error: subscription_lineitems_error } = await supabase
    .from("subscription_lineitems")
    .update({
      price_id: event.data.object.items.data[0].plan.id,
      product_id: event.data.object.items.data[0].plan.product as string,
      line_items_id: event.data.object.items.data[0].id,
      productname: `${event.data.object.items.data[0].plan.metadata?.plan} (${event.data.object.items.data[0].plan.metadata?.Interval})`,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.itemlines_id as string);

  if (subscription_lineitems_error)
    console.error(
      "Error updating subscription line items:",
      subscription_lineitems_error
    );

  const { error: userRoleError } = await supabase
    .from("subscription_user_role")
    .update({
      user_role: ["Premium", "Pro"].includes(
        event.data.object.items.data[0].plan.metadata?.plan || ""
      )
        ? (event.data.object.items.data[0].plan.metadata?.plan as
            | "Premium"
            | "Pro")
        : undefined,
      Interval:
        event.data.object.items.data[0].plan.metadata?.Interval ||
        "Not Specified",
    })
    .eq("cus_id", event.data.object.customer as string);
  if (userRoleError) console.error("Error updating user role:", userRoleError);
  return data;
}

// invoice payment succeeded webhook to update subscription status
export async function InvoiceItemCreate(event: Stripe.InvoiceItemCreatedEvent) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription")
    .update({
      subscription_invoice_id: event.data.object.invoice as string,
    })
    .eq("subscription_customer_id", event.data.object.customer as string);
  if (error) console.error("Error updating invoice item:", error);
  return data;
}
