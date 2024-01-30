<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc } from "firebase/firestore";
import { booksRef, type Book, editionsRef } from "@/firebase";
import { inputValue } from "@/utils";
import TextInput from "./TextInput.vue";
import RefInput from "./RefInput.vue";

const all_books = useCollection<Book>(booksRef);

const user = useCurrentUser();

async function editionSubmit(event: Event) {
    const subtitle = inputValue("subtitle");
    await addDoc(editionsRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        title: inputValue("edition-title"),
        ...(subtitle && { subtitle }),
        books: [doc(booksRef, inputValue("book"))],
        publisher: inputValue("publisher"),
        url: inputValue("url"),
    });
    alert("Edition uploaded successfully");
    (<HTMLFormElement>event.target).reset();
}
</script>

<template>
    <h2>Upload Edition</h2>
    <form @submit.prevent="editionSubmit">
        <TextInput field="edition-title" label="Title" required />
        <TextInput field="subtitle" label="Subtitle" />
        <RefInput field="book" label="Book" :collection="all_books" v-slot="{ doc }">
            {{ doc.title }} by {{ doc.authors[0].surname }}
        </RefInput>
        <!-- TODO: convert from text to a ref -->
        <TextInput field="publisher" label="Publisher" required />
        <TextInput field="url" label="URL" />
        <button>Upload</button>
    </form>
</template>
