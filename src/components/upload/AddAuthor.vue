<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import { authorsRef } from "@/firebase";
import { getInputById, inputValue } from "@/utils";
import TextInput from "@/components/TextInput.vue";
import AddForm from "./AddForm.vue";

async function authorSubmit(event: Event, uploader: string) {
    const newAuthor = await addDoc(authorsRef, {
        uploader,
        given_name: inputValue("given_name"),
        surname: inputValue("surname"),
        surname_first: getInputById("surname_first").checked,
    });
    alert("Author uploaded successfully");
    (<HTMLFormElement>event.target).reset();
    getInputById("author").value = newAuthor.id;
}
</script>

<template>
    <AddForm name="Author" @submit="authorSubmit">
        <TextInput field="given_name" label="Given Name" required />
        <TextInput field="surname" label="Surname" required />
        <div class="checkbox">
            <input type="checkbox" name="surname_first" id="surname_first" />
            <label for="surname_first">Surname should display first</label>
        </div>
    </AddForm>
</template>

<style scoped>
.checkbox {
    display: flex;
    margin-bottom: 0.5em;
}
</style>
