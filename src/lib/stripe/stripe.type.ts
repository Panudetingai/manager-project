import Stripe from "stripe";

export interface StripeReponse {
    data: Stripe.Product[];
    meta_data: {
        feature: Record<string, string>[];
    }
}
