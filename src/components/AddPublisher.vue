<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { publishersRef } from "../firebase";
import { getInputById, inputValue } from "@/utils";
import TextInput from "./TextInput.vue";

const user = useCurrentUser();

async function publisherSubmit(event: Event) {
    const newPub = await addDoc(publishersRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        publisher: inputValue("publisher"),
    });
    alert("Publisher uploaded successfully");
    (<HTMLFormElement>event.target).reset();
    getInputById("edition-publisher").value = newPub.id;
}
</script>

<template>
    <h2>Upload Publisher</h2>
    <form @submit.prevent="publisherSubmit">
        <TextInput field="publisher" label="Publisher" required />
        <button type="submit">Upload</button>
    </form>
</template>
