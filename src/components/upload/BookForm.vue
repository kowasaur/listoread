<script setup lang="ts">
import { useCollection } from "vuefire";
import { doc, orderBy, query } from "firebase/firestore";
import { type Book, authorsRef, type Author } from "@/firebase";
import { fullName, getInputById, inputValue } from "@/utils";
import TextInput from "../TextInput.vue";
import MultiRef from "../MultiRef.vue";
import UserForm from "../UserForm.vue";

defineProps<{ heading: string } & Partial<Pick<Book, "title">>>();
const emit = defineEmits<{ submit: [data: Record<string, any>] }>();
const selectedAuthors = defineModel<string[]>({ required: true });

// TODO: https://stackoverflow.com/questions/46568142/google-firestore-query-on-substring-of-a-property-value-text-search
// Current implementation will not work well once there's a lot of authors
const allAuthors = useCollection<Author>(query(authorsRef, orderBy("surname")), {
    ssrKey: "all-authors",
});

function handleSubmit(_: Event, uploader: string) {
    const data: Record<string, any> = {
        uploader,
        title: inputValue("title"),
        authors: selectedAuthors.value.map(a => doc(authorsRef, a)),
    };

    emit("submit", data);
    getInputById("title").value = "";
}
</script>

<template>
    <UserForm :title="heading" @submit="handleSubmit">
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
    </UserForm>
</template>
