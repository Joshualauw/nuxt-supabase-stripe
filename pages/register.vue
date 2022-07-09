<template>
    <div class="min-h-full w-1/2 mx-auto flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <h2 class="my-6 text-center text-2xl font-bold">Sign Up a new account</h2>
        <form @submit.prevent="register" class="flex flex-col space-y-5 w-full">
            <input type="text" v-model="email" placeholder="email" class="px-4 py-2 rounded-md border-2" />
            <input type="text" v-model="username" placeholder="username" class="px-4 py-2 rounded-md border-2" />
            <input type="password" v-model="password" placeholder="password" class="px-4 py-2 rounded-md border-2" />
            <button :disabled="loading" class="px-4 py-2 rounded-md bg-black text-white">Sign Up</button>
            <p v-if="errors" class="text-red-500">* {{ errors }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient();

const email = ref<string>("");
const username = ref<string>("");
const password = ref<string>("");
const errors = ref<string>("");
const loading = ref<boolean>(false);

const register = async () => {
    if (!username.value || !password.value || !email.value) {
        errors.value = "all fields must be required";
        return;
    }

    errors.value = "";
    loading.value = true;
    const { error } = await client.auth.signUp(
        { email: email.value, password: password.value },
        {
            data: {
                username: username.value,
                profile_picture:
                    "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
            },
        }
    );
    loading.value = false;
    if (error) {
        errors.value = `[${error.status}] - ${error.message}`;
        return;
    }
    alert("register succesful");
};
</script>
