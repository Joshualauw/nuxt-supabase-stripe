<template>
    <div class="min-h-full w-1/2 mx-auto flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <h2 class="my-6 text-center text-2xl font-bold">Sign in to your account</h2>
        <form @submit.prevent="login" class="flex flex-col space-y-5 w-full">
            <input type="text" v-model="email" placeholder="email" class="px-4 py-2 rounded-md border-2" />
            <input type="password" v-model="password" placeholder="password" class="px-4 py-2 rounded-md border-2" />
            <button :disabled="loading" class="px-4 py-2 rounded-md bg-black text-white w-full">Sign in</button>
            <p v-if="errors" class="text-red-500">* {{ errors }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { Cart } from "~~/types/types";

const user = useSupabaseUser();
const client = useSupabaseClient();
const cartCount = useCartCount();

const email = ref<string>("");
const password = ref<string>("");
const errors = ref<string>("");
const loading = ref<boolean>(false);

const login = async () => {
    errors.value = "";
    if (!email.value || !password.value) {
        errors.value = "email or password is required";
        return;
    }

    loading.value = true;
    const { error } = await client.auth.signIn(
        { email: email.value, password: password.value },
        { shouldCreateUser: false }
    );
    loading.value = false;
    if (error) {
        errors.value = `[${error.status}] - ${error.message}`;
        return;
    }
    alert("login successful");
};

watchEffect(async () => {
    if (user.value) {
        const { data } = await client.from<Cart>("carts").select().match({ user_id: user.value.id });
        cartCount.value = data.length;
        navigateTo("/");
    }
});
</script>
