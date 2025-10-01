"use server";
import { BillingInfoType } from "@/modules/manager/billing/components/card-billing-plan";
import { Stripe } from "stripe";
import { CreateServiceStripe } from "../stripe.service";

interface funcgetProduct {
  products: Stripe.Product[];
}

export async function fucngetProducts({
  products,
}: funcgetProduct): Promise<BillingInfoType[]> {
  const stripe = CreateServiceStripe();
  return Promise.all(
    products.map(async (product) => {
      const productPrices = await stripe.RetrievePrices(
        product.default_price as string
      );
      return {
        priceId: productPrices.id,
        priceIdDefault: product.default_price as string,
        plan: product.name,
        plandescription: product.description || "",
        pricedescription: `${
          productPrices.unit_amount &&
          (productPrices.unit_amount / 100).toFixed(2)
        } ${productPrices.currency?.toUpperCase()} / ${
          productPrices.recurring?.interval
        }`,
        price: `${
          productPrices.unit_amount &&
          (productPrices.unit_amount / 100).toFixed(2)
        } ${productPrices.currency?.toUpperCase()} / ${
          productPrices.recurring?.interval
        }`,
        features: product.marketing_features,
        billingCycle: productPrices.recurring?.interval as "month" | "year",
      };
    })
  );
}
