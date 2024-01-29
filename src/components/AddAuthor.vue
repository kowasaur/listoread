<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { authorsRef } from "../firebase";
import { inputValue } from "@/utils";
import TextInput from "./TextInput.vue";

const user = useCurrentUser();

async function authorSubmit(event: Event) {
    await addDoc(authorsRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        given_name: inputValue("given_name"),
        surname: inputValue("surname"),
    });
    alert("Author uploaded successfully");
    (<HTMLFormElement>event.target).reset();
}
</script>

<template>
    <h2>Upload Author</h2>
    <form @submit.prevent="authorSubmit">
        <TextInput field="surname" label="Surname" required />
        <TextInput field="given_name" label="Given Name" />
        <button type="submit">Upload</button>
    </form>
</template>
