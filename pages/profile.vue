<template>
    <div class="min-h-full w-1/2 mx-auto flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
        <img :src="user.user_metadata.profile_picture" class="w-48 h-48 rounded-full mb-4" />
        <p class="text-xl font-semibold mb-8">{{ user.user_metadata.username }}</p>
        <button @click="isEdit = !isEdit" class="px-3 py-1 rounded-md bg-black text-white">
            Edit {{ isEdit ? "On" : "Off" }}
        </button>
        <form v-if="isEdit" @submit.prevent="submitForm" class="flex flex-col space-y-5 mt-4 p-5 rounded-md">
            <div>
                <p class="mb-2 text-black font-semibold">Enter new username:</p>
                <input
                    type="text"
                    v-model="username"
                    placeholder="enter here..."
                    class="px-2 py-1 rounded-md w-full border-2 text-gray-700"
                />
            </div>
            <div>
                <input
                    ref="fileImage"
                    @change="handleUpload"
                    type="file"
                    class="px-2 py-1 rounded-md file:rounded-full file:bg-black file:text-white file:cursor-pointer file:hover:opacity-90 file:border-0 file:px-3 file:py-1 file:mr-4"
                />
            </div>
            <button class="px-3 py-1 rounded-lg bg-blue-500 text-white hover:opacity-90">Save Changes</button>
            <p v-if="errors" class="text-red-500 mt-4">* {{ errors }}</p>
        </form>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
});

const user = useSupabaseUser();
const client = useSupabaseClient();

const username = ref<string>(user.value.user_metadata.username);
const isEdit = ref<boolean>(false);
const fileImage = ref(null);
const fileData = ref(null);
const errors = ref<string>("");

const handleUpload = () => {
    if (fileImage.value.files) {
        if (/\.(jpe?g|png|gif)$/i.test(fileImage.value.files[0].name)) {
            fileData.value = fileImage.value.files[0];
        }
    }
};

const submitForm = async () => {
    errors.value = "";
    if (!username.value) {
        errors.value = "username is required";
        return;
    }

    const extension = fileData.value.name.split(".")[1];
    const imagePath = user.value.id.replaceAll("-", "") + "." + extension;
    const { error } = await client.storage.from("colorfest-bucket").upload(`avatars/${imagePath}`, fileData.value, {
        upsert: true,
    });
    if (!error) {
        const { signedURL } = await client.storage.from("colorfest-bucket").createSignedUrl(`avatars/${imagePath}`, 60);
        await client.auth.update({
            data: { username: username.value, profile_picture: signedURL },
        });
        alert("profile updated");
    } else {
        errors.value = error.message;
    }
};
</script>
