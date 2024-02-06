<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import {
    type DocumentReference,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
} from "firebase/firestore";
import { useCurrentUser, type VueFirestoreQueryData } from "vuefire";
import { type Reading, readingsRef, type Book, booksRef } from "@/firebase";

const props = defineProps<{
    editionDoc: DocumentReference;
    readings: VueFirestoreQueryData<Reading>;
    book: Book;
}>();

const user = useCurrentUser();
const router = useRouter();

const currentlyReading = computed(() =>
    props.readings.find(r => !r.finish && r.book.id === props.book.id)
);

async function startReading() {
    await addDoc(readingsRef, {
        uploader: user.value!.uid,
        edition: props.editionDoc,
        book: doc(booksRef, props.book.id),
        start: serverTimestamp(),
        finish: null,
    });
    router.push("/");
}

function finishReading() {
    updateDoc(doc(readingsRef, currentlyReading.value!.id), { finish: serverTimestamp() });
}
</script>

<template>
    <template v-if="user">
        <button v-if="!currentlyReading" @click="startReading">Start Reading</button>
        <button v-else @click="finishReading">Finish Reading</button>
    </template>
</template>

<style scoped>
button {
    margin-bottom: 0.2rem;
}
</style>
