<script setup lang="ts">
import { ref } from "vue";
import { addDoc, doc, type DocumentReference } from "firebase/firestore";
import DateInput from "./DateInput.vue";
import ModalForm from "./ModalForm.vue";
import RefInput from "./RefInput.vue";
import { readingsRef, booksRef, type Book } from "@/firebase";
import { inputValue } from "@/utils";

const { editionDoc } = defineProps<{ books: Book[]; editionDoc: DocumentReference }>();
const show = defineModel<boolean>({ required: true });

const start = ref<Date>();
const finish = ref<Date>();

async function submit(uploader: string) {
    await addDoc(readingsRef, {
        uploader,
        edition: editionDoc,
        book: doc(booksRef, inputValue("reading-book")),
        start: start.value ?? null,
        finish: finish.value ?? null,
    });
    show.value = false;
}
</script>

<template>
    <ModalForm title="Add New Reading" @submit="submit" v-model="show">
        <RefInput field="reading-book" label="Book" :collection="books" v-slot="{ doc }">
            {{ doc.title }}
        </RefInput>

        <DateInput field="start" label="Start" v-model="start" />
        <DateInput field="finish" label="Finish" v-model="finish" :start-date="start" />
    </ModalForm>
</template>
