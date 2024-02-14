<script setup lang="ts">
import { ref } from "vue";
import { addDoc } from "firebase/firestore";
import { booksRef, editionsRef, type Author, authorsRef } from "@/firebase";
import { getInputById } from "@/utils";
import AddPublisher from "@/components/upload/AddPublisher.vue";
import RequireSignIn from "@/components/RequireSignIn.vue";
import EditionForm from "@/components/upload/EditionForm.vue";
import BookForm from "@/components/upload/BookForm.vue";
import AuthorForm from "@/components/upload/AuthorForm.vue";

const authors = ref<string[]>([""]);
const books = ref<string[]>([""]);

async function authorSubmit(data: Omit<Author, "id">) {
    const newAuthor = await addDoc(authorsRef, data);
    authors.value = [newAuthor.id];
    alert("Author uploaded successfully");
}

async function bookSubmit(data: Record<string, any>) {
    const newBook = await addDoc(booksRef, data);
    getInputById("edition-title").value = data.title;
    books.value = [newBook.id];
    alert("Book uploaded successfully");
}

async function editionSubmit(data: Record<string, any>) {
    await addDoc(editionsRef, data);
    alert("Edition uploaded successfully");
}
</script>

<template>
    <RequireSignIn>
        <!-- TODO: make it so each "tab" can be minimised -->
        <div class="uploads">
            <AuthorForm heading="Upload Author" class="add-form" @submit="authorSubmit" />
            <AddPublisher />
            <BookForm
                heading="Upload Book"
                class="add-form"
                v-model="authors"
                @submit="bookSubmit"
            />
            <EditionForm
                heading="Upload Edition"
                class="add-form"
                @submit="editionSubmit"
                v-model="books"
            />
        </div>
    </RequireSignIn>
</template>

<style scoped>
.uploads {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>
