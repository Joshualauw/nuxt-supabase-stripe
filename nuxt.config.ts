import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        stripe_secret: process.env.STRIPE_SECRET_KEY,
        public: {
            APP_NAME: "Colorfest",
            BASE_URL: process.env.BASE_URL,
        },
    },
    modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
});
