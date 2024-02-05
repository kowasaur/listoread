<script setup lang="ts">
import { doc } from "firebase/firestore";
import { useDocument } from "vuefire";
import { useRoute } from "vue-router/auto";
import { booksRef, type Book } from "@/firebase";
import BookTitleAuthors from "@/components/BookTitleAuthors.vue";

const route = useRoute("/book/[id]");
const { pending, data: book } = useDocument<Book>(doc(booksRef, route.params.id));
</script>

<template>
    <div v-if="pending">Loading...</div>
    <div v-else-if="!book">No book with the ID {{ route.params.id }} exists</div>
    <div v-else class="container">
        <main>
            <BookTitleAuthors :title="book.title" :authors="book.authors" />
        </main>
    </div>
</template>
