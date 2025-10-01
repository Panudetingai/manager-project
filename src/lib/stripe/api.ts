import Elysia from "elysia";
import { CreateServiceStripe } from "./stripe.service";

const webhook = new Elysia()
    .post("/webhook", async ({request}) => {
        const stripeService = CreateServiceStripe();
        return await stripeService.webhooks(request);
    })

export default webhook;