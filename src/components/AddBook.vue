<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc } from "firebase/firestore";
import { authorsRef, booksRef, type Author } from "@/firebase";
import { fullName, inputValue } from "@/utils";
import TextInput from "./TextInput.vue";
import RefInput from "./RefInput.vue";

// TODO: https://stackoverflow.com/questions/46568142/google-firestore-query-on-substring-of-a-property-value-text-search
// Current implementation will not work well once there's a lot of authors
const all_authors = useCollection<Author>(authorsRef);

const user = useCurrentUser();

async function bookSubmit(event: Event) {
    await addDoc(booksRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        title: inputValue("title"),
        authors: [doc(authorsRef, inputValue("author"))],
    });
    alert("Book uploaded successfully");
}
</script>

<template>
    <h2>Upload Book</h2>
    <form @submit.prevent="bookSubmit">
        <TextInput field="title" label="Title" required />

        <!-- TODO: multiple authors -->
        <RefInput label="Author" field="author" :collection="all_authors" v-slot="{ doc }">
            {{ fullName(doc) }}
        </RefInput>

        <button>Upload</button>
    </form>
</template>
