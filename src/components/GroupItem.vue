<script setup lang="ts">
import { computed } from "vue";
import { doc, where } from "firebase/firestore";
import { useCollection, useCurrentUser } from "vuefire";
import { whereUser, type Edition, readingsRef, editionsRef, type Reading } from "@/firebase";
import { capLength } from "@/utils";

const props = defineProps<{ edition: Edition }>();

const user = useCurrentUser();

const readings = useCollection<Reading>(
    whereUser(
        readingsRef,
        user.value,
        where("edition", "==", doc(editionsRef, props.edition.id)),
        where("finish", "!=", null)
    ),
    { ssrKey: "list item readings" }
);

const finished = computed(() => new Set(readings.value.map(r => r.book.id)));
</script>

<template>
    <div class="outer" :class="{ faded: finished.size == edition.books.length }">
        <img v-if="edition.img_url" :src="edition.img_url" alt="Cover of the Edition" height="40" />
        <div class="inner">
            <RouterLink :to="'edition/' + edition.id">{{ edition.title }}</RouterLink>
            <div
                v-if="edition.books.length > 1"
                v-for="book in edition.books"
                :class="{ faded: finished.has(book.id) }"
            >
                <RouterLink :to="`book/${book.id}`">{{ capLength(book.title) }}</RouterLink>
            </div>
        </div>
    </div>
</template>

<style scoped>
.outer {
    display: flex;
    align-items: center;
    margin-top: 0.3em;
    margin-bottom: 0.3em;
    padding: 0.4em;
    max-width: 21rem;
}

.inner {
    font-size: 0.9rem;
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
    /* Needs to be rem so font-size: 0 doesn't break the margin */
    margin-right: 0.4rem;
}

.faded {
    opacity: 60%;
    background-color: rgba(146, 146, 146, 0.096);
}
</style>
