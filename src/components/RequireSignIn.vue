<script setup lang="ts">
import { useCurrentUser } from "vuefire";
const user = useCurrentUser();
</script>

<template>
    <div v-if="!user">You need to sign in to use this page</div>
    <slot v-else></slot>
</template>
