<script setup lang="ts">
import { ref } from "vue";
import { useCollection } from "vuefire";
import { doc, orderBy, query } from "firebase/firestore";
import { booksRef, type Book, type Publisher, type Edition, publishersRef } from "@/firebase";
import { inputValue } from "@/utils";
import TextInput from "../TextInput.vue";
import MultiRef from "../MultiRef.vue";
import RefInput from "../RefInput.vue";
import UserForm from "../UserForm.vue";

// keyof Doc can't be used because of Vue Typescript compiler limitations
const { books } = defineProps<{ heading: string } & Partial<Omit<Edition, "id" | "uploader">>>();
const emit = defineEmits<{ submit: [data: Record<string, any>] }>();

const allBooks = useCollection<Book>(query(booksRef, orderBy("title")), { ssrKey: "all-books" });
const publishers = useCollection<Publisher>(query(publishersRef, orderBy("publisher")), {
    ssrKey: "all-publishers",
});

const selectedBooks = ref<string[]>(books?.map(b => b.id) ?? [""]);

function handleSubmit(event: Event, uploader: string) {
    const data: Record<string, any> = {
        uploader,
        title: inputValue("edition-title"),
        subtitle: inputValue("subtitle"),
        books: selectedBooks.value.map(b => doc(booksRef, b)),
        publisher: doc(publishersRef, inputValue("edition-publisher")),
        url: inputValue("url"),
        img_url: inputValue("img_url"),
    };

    // get rid of empty (optional) fields
    Object.keys(data).forEach(k => data[k] === "" && delete data[k]);

    emit("submit", data);
    (<HTMLFormElement>event.target).reset();
    selectedBooks.value = [""];
}
</script>

<template>
    <UserForm :title="heading" @submit="handleSubmit">
        <TextInput field="edition-title" label="Title" required :initial-value="title" />
        <TextInput field="subtitle" label="Subtitle" :initial-value="subtitle" />
        <MultiRef
            v-model="selectedBooks"
            field="book"
            label="Book"
            :collection="allBooks"
            v-slot="{ doc }"
        >
            {{ doc.title }} by {{ doc.authors.map(a => a.surname).join(", ") }}
        </MultiRef>
        <RefInput
            field="edition-publisher"
            label="Publisher"
            :collection="publishers"
            v-slot="{ doc }"
            :initial-value="publisher?.id"
        >
            {{ doc.publisher }}
        </RefInput>
        <TextInput field="url" label="URL" :initial-value="url" />
        <TextInput field="img_url" label="Image URL" :initial-value="img_url" />
    </UserForm>
</template>
