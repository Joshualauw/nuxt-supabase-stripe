import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            APP_NAME: "Colorfest",
        },
    },
    modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],
});
