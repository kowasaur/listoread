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

const authors = computed(() =>
    (edition.value?.books ?? [])
        .flatMap(b => b.authors)
        .filter((a, i, all) => all.findIndex(a2 => a2.id === a.id) === i)
);

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
                <template v-for="(a, i) in authors" :to="`authors/${a.id}`">
                    <RouterLink :to="`authors/${a.id}`">{{ fullName(a) }}</RouterLink>
                    <template v-if="i === authors.length - 2"> and </template>
                    <template v-else-if="i < authors.length - 1">, </template>
                </template>
            </h3>

            <p v-if="edition.books.length === 1">
                An edition of
                <RouterLink :to="`books/${edition.books[0].id}`">
                    <i>{{ edition.books[0].title }}</i>
                </RouterLink>
                published by {{ edition.publisher.publisher
                }}<template v-if="edition.url"> available <a :href="edition.url">here</a> </template
                >.
            </p>
            <template v-else>
                <p>
                    An edition published by {{ edition.publisher.publisher }}
                    <template v-if="edition.url">
                        available <a :href="edition.url">here</a>
                    </template>
                    containing:
                </p>
                <ul>
                    <li v-for="book in edition.books">
                        <RouterLink :to="`book/${book.id}`">
                            <i> {{ book.title }} </i>
                        </RouterLink>
                    </li>
                </ul>
            </template>

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
