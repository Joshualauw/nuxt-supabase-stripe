<template>
    <div
        v-if="!pending"
        class="flex flex-col md:flex-row justify-center items-center md:items-start mx-20 md:space-x-20 mt-10 mb-14"
    >
        <div class="w-full md:w-[600px] h-full">
            <h1 class="text-2xl font-bold border-b pb-4 border-gray-300 mb-6">Shopping Cart</h1>
            <div v-if="carts.length == 0" class="text-lg font-semibold text-center">Your cart is empty!</div>
            <div
                v-else
                v-for="cart in carts"
                class="mb-6 h-40 flex justify-start items-start space-x-6 border-b pb-6 border-gray-300"
            >
                <div class="h-full w-1/3" :style="`background-color: ${cart.colors.name}`">.</div>
                <div class="flex flex-col flex-1">
                    <p class="text-lg font-semibold">{{ cart.colors.name }}</p>
                    <p class="text-lg font-semibold">${{ cart.colors.price }}.00</p>
                    <div class="flex items-center justify-between mt-5 w-full">
                        <div class="flex items-center space-x-3">
                            <button
                                @click="minCount(cart)"
                                class="w-6 h-6 rounded-lg flex justify-center items-center bg-gray-200"
                            >
                                -
                            </button>
                            <p>{{ cart.count }}</p>
                            <button
                                @click="addCount(cart)"
                                class="w-6 h-6 rounded-lg flex justify-center items-center bg-gray-200"
                            >
                                +
                            </button>
                        </div>
                        <p class="text-lg font-semibold">${{ cart.count * cart.colors.price }}.00</p>
                    </div>
                </div>
            </div>
        </div>
        <form @submit.prevent="buyCart" class="w-[300px] h-full p-5 bg-gray-100 rounded-md mt-10">
            <h1 class="text-xl font-semibold mb-4">Order Summary</h1>
            <div class="flex justify-between items-center mb-5">
                <p>Subtotal</p>
                <p>${{ subtotal }}.00</p>
            </div>
            <div class="flex justify-between items-center mb-5">
                <p>Taxes</p>
                <p>${{ subtotal / 10 }}.00</p>
            </div>
            <hr />
            <div class="flex justify-between items-center mb-5">
                <p>Total</p>
                <p>${{ subtotal + subtotal / 10 }}.00</p>
            </div>
            <button class="px-4 py-2 rounded-md bg-black text-white w-full">Checkout</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { Cart } from "~~/types/types";
import Swal from "sweetalert2";

definePageMeta({
    middleware: ["auth"],
});

const client = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

const pending = ref<boolean>(false);
const carts = ref<Cart[]>([]);

pending.value = true;
const { data } = await client.from<Cart>("carts").select(`*, colors(*)`).match({ user_id: user.value.id });
carts.value = [];
carts.value.push(...data);
pending.value = false;

if (route.query.success) {
    Swal.fire({
        title: "payment successful",
        icon: "success",
    });
}
if (route.query.canceled) {
    Swal.fire({
        title: "payment canceled",
        icon: "warning",
    });
}

delete route.query.success;
delete route.query.error;

const subtotal = computed(() => {
    let total = 0;
    carts.value.forEach((c) => {
        total += c.count * c.colors.price;
    });
    return total;
});

const updateCart = async (cart: Cart) => {
    await client
        .from<Cart>("carts")
        .update({
            count: cart.count,
        })
        .eq("id", cart.id);
};

const buyCart = async () => {
    const { data, error } = await $fetch("/api/buy", {
        method: "POST",
        body: carts.value,
    });
    if (!error) {
        await client.from<Cart>("carts").delete().match({ user_id: user.value.id });
        window.location.href = data.url;
    } else {
        console.log(error);
    }
};

const addCount = async (cart: Cart) => {
    cart.count++;
    await updateCart(cart);
};

const minCount = async (cart: Cart) => {
    cart.count--;
    if (cart.count == 0) {
        await client.from<Cart>("carts").delete().eq("id", cart.id);
        carts.value = carts.value.filter((c) => c.id != cart.id);
    } else {
        await updateCart(cart);
    }
};
</script>
