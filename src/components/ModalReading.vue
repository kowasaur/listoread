<script setup lang="ts">
import { ref } from "vue";
import { addDoc, doc, type DocumentReference } from "firebase/firestore";
import { readingsRef, booksRef, type Book } from "@/firebase";
import { inputValue } from "@/utils";
import DateInput from "@/components/input/DateInput.vue";
import RefInput from "@/components/input/RefInput.vue";
import ModalForm from "@/components/ModalForm.vue";

const { editionDoc } = defineProps<{ books: Book[]; editionDoc: DocumentReference }>();
const show = defineModel<boolean>({ required: true });

const start = ref<Date>();
const finish = ref<Date | number>();

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
        <RefInput
            field="reading-book"
            label="Book"
            :collection="books"
            v-slot="{ doc }"
            :initial-value="books[0].id"
        >
            {{ doc.title }}
        </RefInput>

        <DateInput field="start" label="Start" v-model="start" />
        <DateInput field="finish" label="Finish" v-model="finish" :start-date="start" can-year />
    </ModalForm>
</template>
