import Stripe from "stripe";
import { ApiResponse } from "~~/types/types";

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    const config = useRuntimeConfig();
    try {
        const stripe = new Stripe(config.stripe_secret, { apiVersion: "2020-08-27" });
        const body = await useBody(event);
        const items = body.map((i) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: i.colors.name,
                    },
                    unit_amount: i.colors.price * 100,
                },
                quantity: i.count,
            };
        });
        event.res.statusCode = 201;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: config.public.BASE_URL + "/cart?success=true",
            cancel_url: config.public.BASE_URL + "/cart?canceled=true",
            line_items: items,
        });
        return { data: { url: session.url } };
    } catch (err: any) {
        event.res.statusCode = 500;
        console.log(err);
        return { error: err.message };
    }
});
