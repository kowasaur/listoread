<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import AddBook from "@/components/upload/AddBook.vue";
import AddAuthor from "../components/upload/AddAuthor.vue";
import AddPublisher from "@/components/upload/AddPublisher.vue";
import RequireSignIn from "@/components/RequireSignIn.vue";
import EditionForm from "@/components/upload/EditionForm.vue";
import { editionsRef } from "@/firebase";

async function editionSubmit(data: Record<string, any>) {
    await addDoc(editionsRef, data);
    alert("Edition uploaded successfully");
}
</script>

<template>
    <RequireSignIn>
        <!-- TODO: make it so each "tab" can be minimised -->
        <div class="uploads">
            <AddAuthor />
            <AddPublisher />
            <AddBook />
            <EditionForm heading="Upload Edition" class="add-form" @submit="editionSubmit" />
        </div>
    </RequireSignIn>
</template>

<style scoped>
.uploads {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>
