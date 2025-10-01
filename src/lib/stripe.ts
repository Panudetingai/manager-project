import Stripe from 'stripe';
import z from 'zod';

const apiKey = z.string().parse(process.env.STRIPE_SECRET_KEY);

export const stripe = new Stripe(
    apiKey,
    {
        apiVersion: '2025-08-27.basil',
        typescript: true,
    }
);