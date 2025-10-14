import Stripe from "stripe";
import z from "zod";
import { stripe } from "../stripe";
import { stripeWebhook } from "./stripe.webhook";

class StripeService {
  private static stripe = stripe;

  /**
   * Handle Stripe webhooks
   * @param request The incoming request
   * @returns A response indicating the result of the webhook processing
   */

  public async webhooks(request: Request) {
    const endpointSecret = z
      .string()
      .nonempty()
      .parse(process.env.STRIPE_WEBHOOK_SECRET);
    const signature = request.headers.get("stripe-signature");

    try {
      const rawBody = await request.arrayBuffer();
      const event = Stripe.webhooks.constructEvent(
        Buffer.from(rawBody),
        signature!,
        endpointSecret
      );

      await stripeWebhook(event);
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      return new Response(`Webhook Error: ${error}`, { status: 400 });
    }
  }

  /**
   * List all products
   */
  public async getProducts(): Promise<Stripe.Product[]> {
    const product = await StripeService.stripe.products.list({
      active: true,
    });
    return product.data;
  }

  /**
   *
   * @param product The ID of the product to retrieve prices for
   * @returns
   */
  public async RetrievePrices(product: string): Promise<Stripe.Price> {
    const prices = await StripeService.stripe.prices.retrieve(product);
    return prices;
  }

  /**
   * Create a checkout session
   * @param priceId The ID of the price to create a checkout session for
   * @param successUrl The URL to redirect to upon successful payment
   */

  public async createCheckoutSession(
    user_id: string,
    priceId: string,
    successUrl: string,
    cancel_url: string,
    mode: Stripe.Checkout.SessionCreateParams.Mode
  ) {
    const session = await StripeService.stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancel_url,
      mode: mode,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { user_id },
    });
    return session;
  }

  /**
   * Retrieve a checkout session by its ID
   * @param sessionId The ID of the checkout session to retrieve
   * @returns The retrieved checkout session
   */

  public async retrieveCheckoutSession(sessionId: string) {
    const session = await StripeService.stripe.checkout.sessions.listLineItems(
      sessionId
    );
    return session;
  }
  /**
   *
   * @returns
   */

  public async getProduct(productId: string) {
    const product = await StripeService.stripe.products.retrieve(productId);
    return product;
  }

  /**
   *
   * @param sessionId
   * @returns
   */

  public async cancelCheckoutSession(sessionId: string) {
    const session = await StripeService.stripe.checkout.sessions.expire(
      sessionId
    );
    return session;
  }

  /**
   *
   * @param customerId
   * @param returnUrl
   * @returns
   */

  public async BillingPortalSession(customerId: string, returnUrl: string) {
    const session = await StripeService.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session;
  }

  /**
   * 
   */

  public async BillingPortalSessionUpdate(){
    
  }
}

export const CreateServiceStripe = () => {
  return new StripeService();
};
