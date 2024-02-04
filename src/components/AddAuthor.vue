<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { authorsRef } from "../firebase";
import { getInputById, inputValue } from "@/utils";
import TextInput from "./TextInput.vue";

const user = useCurrentUser();

async function authorSubmit(event: Event) {
    const newAuthor = await addDoc(authorsRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        given_name: inputValue("given_name"),
        surname: inputValue("surname"),
        surname_first: (<HTMLInputElement>document.getElementById("surname_first")).checked,
    });
    alert("Author uploaded successfully");
    (<HTMLFormElement>event.target).reset();
    getInputById("author").value = newAuthor.id;
}
</script>

<template>
    <h2>Upload Author</h2>
    <form @submit.prevent="authorSubmit">
        <TextInput field="given_name" label="Given Name" required />
        <TextInput field="surname" label="Surname" required />
        <div>
            <label for="surname_first">Surname should display first</label>
            <input type="checkbox" name="surname_first" id="surname_first" />
        </div>
        <button type="submit">Upload</button>
    </form>
</template>
