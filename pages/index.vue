<template>
    <div class="mx-8 sm:mx-14 md:mx-20 my-10">
        <div
            v-if="!pending"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4"
        >
            <div v-for="color in colors" class="h-60 border">
                <div class="h-1/3 w-full" :style="`background-color: ${color.name}`">.</div>
                <div class="p-4">
                    <p class="text-lg font-semibold">{{ color.name }}</p>
                    <p class="text-gray-500 h-12 mb-6">{{ color.description }}</p>
                    <div class="flex justify-between items-center">
                        <p class="text-lg font-bold">${{ color.price }}.00</p>
                        <button
                            @click="addCart(color)"
                            class="px-3 py-1 text-sm md:text-base bg-blue-600 hover:bg-blue-900 text-white"
                        >
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-xl text-center m-10">Loading...</div>
    </div>
</template>

<script setup lang="ts">
import { Cart, Color } from "~~/types/types";

definePageMeta({
    middleware: ["auth"],
});

const client = useSupabaseClient();
const user = useSupabaseUser();

const {
    data: colors,
    pending,
    refresh,
} = await useAsyncData("colors", async () => {
    const { data } = await client.from<Color>("colors").select();
    return data;
});

onMounted(async () => {
    const subscribeColors = await client
        .from("colors")
        .on("*", () => {
            refresh();
        })
        .subscribe();
});

const addCart = async (color: Color) => {
    const { data } = await client.from<Cart>("carts").select().match({ user_id: user.value.id, color_id: color.id });
    if (data.length == 0) {
        await client.from<Cart>("carts").insert({
            user_id: user.value.id,
            color_id: color.id,
            count: 1,
        });
    } else {
        await client
            .from<Cart>("carts")
            .update({
                count: data[0].count + 1,
            })
            .match({ user_id: user.value.id, color_id: color.id });
    }
};
</script>
