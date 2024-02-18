<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import { publishersRef } from "@/firebase";
import { getInputById, inputValue } from "@/utils";
import TextInput from "@/components/input/TextInput.vue";
import AddForm from "./AddForm.vue";

async function publisherSubmit(event: Event, uploader: string) {
    const newPub = await addDoc(publishersRef, {
        uploader,
        publisher: inputValue("publisher"),
    });
    alert("Publisher uploaded successfully");
    (<HTMLFormElement>event.target).reset();
    getInputById("edition-publisher").value = newPub.id;
}
</script>

<template>
    <AddForm name="Publisher" @submit="publisherSubmit">
        <TextInput field="publisher" label="Publisher" required />
    </AddForm>
</template>
