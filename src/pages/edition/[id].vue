<script setup lang="ts">
import { booksRef, readingsRef, editionsRef, type Edition, type Reading } from "@/firebase";
import { fullName } from "@/utils";
import { addDoc, doc, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { computed } from "vue";
import { useRouter } from "vue-router/auto";
import { useRoute } from "vue-router/auto";
import { useCollection, useCurrentUser, useDocument } from "vuefire";

const route = useRoute("/edition/[id]");
const router = useRouter();
const user = useCurrentUser();

const editionDoc = doc(editionsRef, route.params.id);
const { pending, data: edition } = useDocument<Edition>(editionDoc);
const authors = computed(() => [...new Set(edition.value?.books.flatMap(b => b.authors))]);

const readings = useCollection<Reading>(
    query(readingsRef, where("uploader", "==", user.value?.uid), where("edition", "==", editionDoc))
);

const currentlyReading = computed(() => readings.value.find(r => !r.finish));

async function startReading() {
    await addDoc(readingsRef, {
        uploader: user.value!.uid,
        edition: editionDoc,
        book: doc(booksRef, edition.value?.books[0].id),
        start: serverTimestamp(),
    });
    router.push("/");
}

function finishReading() {
    updateDoc(doc(readingsRef, currentlyReading.value?.id), { finish: serverTimestamp() });
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

            <template v-if="user">
                <button v-if="!currentlyReading" @click="startReading">Start Reading</button>
                <button v-else @click="finishReading">Finish Reading</button>

                <h3>Readings</h3>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Start</th>
                            <th scope="col">Finish</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in readings">
                            <td>{{ r.start?.toDate().toLocaleString("en-au") }}</td>
                            <td>{{ r.finish?.toDate().toLocaleString("en-au") }}</td>
                        </tr>
                    </tbody>
                </table>
            </template>

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
