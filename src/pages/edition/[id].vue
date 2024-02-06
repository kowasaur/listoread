<script setup lang="ts">
import { computed } from "vue";
import { useCollection, useCurrentUser, useDocument } from "vuefire";
import { doc, query, where } from "firebase/firestore";
import { useRoute } from "vue-router/auto";
import { readingsRef, editionsRef, type Edition, type Reading, whereUser } from "@/firebase";
import { editionAuthors } from "@/utils";
import BookTitleAuthors from "@/components/BookTitleAuthors.vue";
import ToggleReading from "@/components/ToggleReading.vue";

const route = useRoute("/edition/[id]");
const user = useCurrentUser();

const editionDoc = doc(editionsRef, route.params.id);
const { pending, data: edition } = useDocument<Edition>(editionDoc, { wait: true });

const authors = computed(() => (edition.value ? editionAuthors(edition.value) : []));

const readings = useCollection<Reading>(
    query(readingsRef, whereUser(user.value), where("edition", "==", editionDoc)),
    { ssrKey: "edition/[id]" }
);
</script>

<template>
    <div v-if="pending">Loading...</div>
    <div v-else-if="!edition">No edition with the ID {{ route.params.id }} exists</div>
    <div v-else class="container">
        <img v-if="edition.img_url" :src="edition.img_url" alt="Picture of the book" width="200" />
        <main>
            <BookTitleAuthors :title="edition.title" :authors="authors">
                <h4>{{ edition.subtitle }}</h4>
            </BookTitleAuthors>

            <template v-if="edition.books.length === 1">
                <p>
                    An edition of
                    <RouterLink :to="`/book/${edition.books[0].id}`">
                        <i>{{ edition.books[0].title }}</i>
                    </RouterLink>
                    published by {{ edition.publisher.publisher
                    }}<template v-if="edition.url">
                        available <a :href="edition.url">here</a> </template
                    >.
                </p>
                <ToggleReading
                    :edition-doc="editionDoc"
                    :book="edition.books[0]"
                    :readings="readings"
                />
            </template>
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
                        <div>
                            <RouterLink :to="`/book/${book.id}`">
                                <i> {{ book.title }} </i>
                            </RouterLink>
                            <ToggleReading
                                :edition-doc="editionDoc"
                                :book="book"
                                :readings="readings"
                            />
                        </div>
                    </li>
                </ul>
            </template>

            <template v-if="user">
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

img {
    align-self: flex-start;
}

li > div {
    display: flex;
    justify-content: space-between;
}
</style>
