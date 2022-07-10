<template>
    <header class="px-8 py-4 bg-black text-white flex justify-between items-center shadow-sm">
        <ClientOnly>
            <h1 class="font-semibold text-xl">{{ config.public.APP_NAME }}</h1>
            <ul class="flex items-center space-x-5">
                <li v-if="user" class="hover:text-sky-600 hover:underline"><NuxtLink to="/">Home</NuxtLink></li>
                <li v-if="!user" class="hover:text-sky-600 hover:underline"><NuxtLink to="/login">Login</NuxtLink></li>
                <li v-if="!user" class="hover:text-sky-600 hover:underline">
                    <NuxtLink to="/register">Register</NuxtLink>
                </li>
                <li class="hover:text-sky-600 hover:underline"><NuxtLink to="/">About</NuxtLink></li>
            </ul>
            <div v-if="user" class="flex items-center space-x-5 relative">
                <NuxtLink to="/cart" class="relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 cursor-pointer"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                        />
                    </svg>
                    <div
                        v-if="cartCount"
                        class="rounded-full bg-red-500 text-sm flex items-center justify-center absolute w-5 h-5 -top-3 -right-3"
                    >
                        {{ cartCount }}
                    </div>
                </NuxtLink>
                <img
                    @click="open = !open"
                    class="rounded-full h-8 w-8 cursor-pointer"
                    :src="user.user_metadata.profile_picture"
                />
                <div v-if="open" class="absolute top-11 -right-2 p-1 border-2 bg-white rounded-md text-black">
                    <NuxtLink to="/profile"
                        ><p class="px-4 hover:bg-gray-200 cursor-pointer border-b py-0.5">profile</p></NuxtLink
                    >
                    <NuxtLink to="/history"
                        ><p class="px-4 hover:bg-gray-200 cursor-pointer border-b py-0.5">transactions</p></NuxtLink
                    >
                    <p @click="logout" class="px-4 hover:bg-gray-200 cursor-pointer py-0.5">logout</p>
                </div>
            </div>
        </ClientOnly>
    </header>
</template>

<script setup lang="ts">
import { Cart } from "~~/types/types";

const config = useRuntimeConfig();
const user = useSupabaseUser();
const client = useSupabaseClient();
const cartCount = useCartCount();
const router = useRouter();

const open = ref<boolean>(false);
const route = useRoute();

watch(route, () => {
    open.value = false;
});

const { refresh } = await useAsyncData("cartCount", async () => {
    if (user.value) {
        const { data } = await client.from<Cart>("carts").select().match({ user_id: user.value.id });
        cartCount.value = data.length;
    }
});

onMounted(async () => {
    const subscribeCarts = await client
        .from("carts")
        .on("INSERT", async () => {
            refresh();
        })
        .on("DELETE", async () => {
            refresh();
        })
        .subscribe();
});

const logout = async () => {
    await client.auth.signOut();
    router.push("/login");
};
</script>
