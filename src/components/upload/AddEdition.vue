<script setup lang="ts">
import { useCollection } from "vuefire";
import { addDoc, doc } from "firebase/firestore";
import { booksRef, type Book, editionsRef, publishersRef, type Publisher } from "@/firebase";
import { inputValue } from "@/utils";
import TextInput from "@/components/TextInput.vue";
import RefInput from "@/components/RefInput.vue";
import AddForm from "./AddForm.vue";

const allBooks = useCollection<Book>(booksRef);
const publishers = useCollection<Publisher>(publishersRef);

async function editionSubmit(event: Event, uploader: string) {
    const data: Record<string, any> = {
        uploader,
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
    <AddForm name="Edition" @submit="editionSubmit">
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
    </AddForm>
</template>
