<script setup lang="ts">
import { useCollection, useCurrentUser } from "vuefire";
import { addDoc, doc } from "firebase/firestore";
import { booksRef, type Book, editionsRef, publishersRef, type Publisher } from "@/firebase";
import { inputValue } from "@/utils";
import TextInput from "./TextInput.vue";
import RefInput from "./RefInput.vue";

const allBooks = useCollection<Book>(booksRef);
const publishers = useCollection<Publisher>(publishersRef);

const user = useCurrentUser();

async function editionSubmit(event: Event) {
    const data: Record<string, any> = {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        title: inputValue("edition-title"),
        subtitle: inputValue("subtitle"),
        books: [doc(booksRef, inputValue("book"))],
        publisher: doc(publishersRef, inputValue("edition-publisher")),
        url: inputValue("url"),
        img_url: inputValue("img_url"),
    };

    // get rid of empty (optional) fields
    Object.keys(data).forEach(k => data[k] === "" && delete data[k]);

    await addDoc(editionsRef, data);
    alert("Edition uploaded successfully");
    (<HTMLFormElement>event.target).reset();
}
</script>

<template>
    <h2>Upload Edition</h2>
    <form @submit.prevent="editionSubmit">
        <TextInput field="edition-title" label="Title" required />
        <TextInput field="subtitle" label="Subtitle" />
        <RefInput field="book" label="Book" :collection="allBooks" v-slot="{ doc }">
            {{ doc.title }} by {{ doc.authors[0].surname }}
        </RefInput>
        <RefInput
            field="edition-publisher"
            label="Publisher"
            :collection="publishers"
            v-slot="{ doc }"
        >
            {{ doc.publisher }}
        </RefInput>
        <TextInput field="url" label="URL" />
        <TextInput field="img_url" label="Image URL" />
        <button>Upload</button>
    </form>
</template>
