<script setup lang="ts">
import { useCollection } from "vuefire";
import { addDoc, doc, orderBy, query } from "firebase/firestore";
import { ref } from "vue";
import { authorsRef, booksRef, type Author } from "@/firebase";
import { fullName, getInputById, inputValue } from "@/utils";
import TextInput from "@/components/TextInput.vue";
import AddForm from "./AddForm.vue";
import MultiRef from "../MultiRef.vue";

// TODO: https://stackoverflow.com/questions/46568142/google-firestore-query-on-substring-of-a-property-value-text-search
// Current implementation will not work well once there's a lot of authors
const allAuthors = useCollection<Author>(query(authorsRef, orderBy("surname")), {
    ssrKey: "all-authors",
});

const selectedAuthors = ref<string[]>([""]);

async function bookSubmit(_: Event, uploader: string) {
    const newBook = await addDoc(booksRef, {
        uploader,
        title: inputValue("title"),
        authors: selectedAuthors.value.map(a => doc(authorsRef, a)),
    });
    alert("Book uploaded successfully");
    getInputById("edition-title").value = inputValue("title");
    getInputById("title").value = "";
}
</script>

<template>
    <AddForm name="Book" @submit="bookSubmit">
        <TextInput field="title" label="Title" required />

        <MultiRef
            v-model="selectedAuthors"
            label="Author"
            field="author"
            :collection="allAuthors"
            v-slot="{ doc }"
        >
            {{ fullName(doc) }}
        </MultiRef>
    </AddForm>
</template>
