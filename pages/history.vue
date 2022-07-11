<template>
    <div v-if="!pending" class="mx-12 md:mx-20 my-10">
        <ClientOnly>
            <div v-for="trans in transactions" class="py-4 px-6 rounded-md bg-gray-200 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                    Transaction date: {{ trans.created_at.substring(0, 10) }}
                    <p class="mt-2 md:mt-0">
                        Status:
                        <span class="py-1 px-3 rounded-full font-semibold mr-2" :class="getStatusColor(trans.status)">{{
                            trans.status
                        }}</span>
                        <span v-if="trans.status == 'success'" class="px-3 py-0.5 rounded-full bg-blue-400">See receipt</span>
                    </p>
                </div>
                <p class="font-bold">Details:</p>
                <p v-for="item in trans.dtrans" class="flex justify-between items-center w-full">
                    <p>{{ item.colors.name }}</p>
                    <p>x{{ item.quantity }}</p>
                </p>
                <p class="border-t pt-2 border-gray-400 flex justify-between items-center w-full mt-3">
                    <p>Total:</p>
                    <p>${{ trans.total }}.00</p>
                </p>
            </div>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { Htrans } from "~~/types/types";

const client = useSupabaseClient();
const user = useSupabaseUser();

const { data: transactions, pending } = await useAsyncData("transactions", async () => {
    const { data } = await client
        .from<Htrans>("htrans")
        .select("*, dtrans(*, colors(*))")
        .eq("user_id",user.value.id );
    return data;
});

const getStatusColor = (status: string) => {
    if (status == "success") return "bg-green-300 text-green-700";
    if (status == "canceled") return "bg-red-300 text-red-700";
    if (status == "pending") return "bg-gray-300 text-gray-700";
};
</script>
