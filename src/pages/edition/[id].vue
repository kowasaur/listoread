<script setup lang="ts">
import { booksRef, readingsRef, editionsRef, type Edition } from "@/firebase";
import { fullName } from "@/utils";
import { addDoc, doc, serverTimestamp } from "firebase/firestore";
import { computed } from "vue";
import { useRouter } from "vue-router/auto";
import { useRoute } from "vue-router/auto";
import { useCurrentUser, useDocument } from "vuefire";

const route = useRoute("/edition/[id]");
const router = useRouter();
const user = useCurrentUser();

const editionDoc = doc(editionsRef, route.params.id);
const { pending, data: edition } = useDocument<Edition>(editionDoc);
const authors = computed(() => [...new Set(edition.value?.books.flatMap(b => b.authors))]);

async function startReading() {
    await addDoc(readingsRef, {
        uploader: user.value!.uid,
        edition: editionDoc,
        book: doc(booksRef, edition.value?.books[0].id),
        start: serverTimestamp(),
    });
    router.push("/");
}
</script>

<template>
    <div v-if="pending">Loading...</div>
    <div v-else-if="!edition">No edition with the ID {{ route.params.id }} exists</div>
    <div v-else class="container">
        <img v-if="edition.img_url" :src="edition.img_url" alt="Picture of the book" width="200" />
        <main>
            <h2>{{ edition.title }}</h2>
            <h4>{{ edition.subtitle }}</h4>
            <h3>
                By
                <!-- TODO: multiple authors -->
                <RouterLink v-for="(a, i) in authors" :to="`authors/${a.id}`">{{
                    fullName(a)
                }}</RouterLink>
            </h3>

            <button @click="startReading">Start Reading</button>
            <!-- TODO: other relavent information -->
        </main>
    </div>
</template>

<style scoped>
.container > * {
    margin-left: 1em;
    margin-right: 1em;
}
</style>
