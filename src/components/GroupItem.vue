<script setup lang="ts">
import { type Edition } from "@/firebase";

defineProps<{ edition: Edition }>();
</script>

<template>
    <div class="outer">
        <img v-if="edition.img_url" :src="edition.img_url" alt="Cover of the Edition" height="50" />
        <div class="inner">
            <RouterLink :to="'edition/' + edition.id">{{ edition.title }}</RouterLink>
            <div v-if="edition.books.length > 1" v-for="book in edition.books">
                <RouterLink :to="`book/${book.id}`">{{ book.title }}</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.outer {
    display: flex;
    align-items: center;
    margin: 0.3em;
    padding: 0.5em;
}

.inner > div {
    font-size: smaller;
    padding: 0.3em;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
}

.outer,
.inner > div {
    border: 1px solid black;
    border-radius: 0.35em;
}

.inner > div:first-of-type {
    margin-top: 0.3em;
}

img {
    margin-right: 0.4em;
}
</style>
