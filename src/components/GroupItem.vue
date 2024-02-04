<script setup lang="ts">
import { type Edition } from "@/firebase";

defineProps<{ edition: Edition }>();
</script>

<template>
    <div class="outer">
        <img v-if="edition.img_url" :src="edition.img_url" alt="Cover of the Edition" height="50" />
        <div class="inner">
            <RouterLink :to="'edition/' + edition.id">{{ edition.title }}</RouterLink>
        </div>
    </div>
</template>

<style scoped>
.outer {
    border: 1px solid black;
    border-radius: 0.35em;
    margin: 0.2em;
    padding: 0.3em;
    display: flex;
}

img {
    margin-right: 0.4em;
}
</style>
