<template>
    <div>
        <Head>
            <Title>{{ config.public.APP_NAME }}</Title>
        </Head>
        <MyNavbar></MyNavbar>
        <div class="container">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
