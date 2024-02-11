<script setup lang="ts">
import {
    authorsRef,
    booksRef,
    editionsRef,
    listGroupsRef,
    listItemsRef,
    publishersRef,
    readingsRef,
    whereUser,
} from "@/firebase";
import { useCollection, useCurrentUser } from "vuefire";

const OPTIONS = { maxRefDepth: 0, once: true };

const user = useCurrentUser();
const authors = useCollection(authorsRef, OPTIONS);
const publishers = useCollection(publishersRef, OPTIONS);
const books = useCollection(booksRef, OPTIONS);
const editions = useCollection(editionsRef, OPTIONS);
const readings = useCollection(whereUser(readingsRef, user.value), OPTIONS);
const groups = useCollection(whereUser(listGroupsRef, user.value), OPTIONS);
const listItems = useCollection(whereUser(listItemsRef, user.value), OPTIONS);

function saveEverything() {
    return URL.createObjectURL(
        new Blob(
            [
                JSON.stringify({
                    authors: authors.value,
                    publishers: publishers.value,
                    books: books.value,
                    editions: editions.value,
                    readings: readings.value,
                    groups: groups.value,
                    listItems: listItems.value,
                }),
            ],
            { type: "text/json" }
        )
    );
}
</script>

<template>
    <div class="container">
        <a :href="saveEverything()" download="listoread.json">
            <button>Download all public and user data</button>
        </a>
    </div>
</template>
