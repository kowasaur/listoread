<script setup lang="ts">
import { useCollection } from "vuefire";
import { addDoc, doc } from "firebase/firestore";
import { authorsRef, booksRef, type Author } from "@/firebase";
import { fullName, getInputById, inputValue } from "@/utils";
import TextInput from "@/components/TextInput.vue";
import RefInput from "@/components/RefInput.vue";
import AddForm from "./AddForm.vue";

// TODO: https://stackoverflow.com/questions/46568142/google-firestore-query-on-substring-of-a-property-value-text-search
// Current implementation will not work well once there's a lot of authors
const all_authors = useCollection<Author>(authorsRef);

async function bookSubmit(_: Event, uploader: string) {
    const newBook = await addDoc(booksRef, {
        uploader,
        title: inputValue("title"),
        authors: [doc(authorsRef, inputValue("author"))],
    });
    alert("Book uploaded successfully");
    getInputById("edition-title").value = inputValue("title");
    getInputById("title").value = "";
    getInputById("book").value = newBook.id;
}
</script>

<template>
    <AddForm name="Book" @submit="bookSubmit">
        <TextInput field="title" label="Title" required />

        <!-- TODO: multiple authors -->
        <RefInput label="Author" field="author" :collection="all_authors" v-slot="{ doc }">
            {{ fullName(doc) }}
        </RefInput>
    </AddForm>
</template>
