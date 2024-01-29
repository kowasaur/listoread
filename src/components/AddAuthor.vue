<script setup lang="ts">
import { addDoc } from "firebase/firestore";
import { useCurrentUser } from "vuefire";
import { authorsRef } from "../firebase";

const inputValue = (id: string) => (<HTMLInputElement>document.getElementById(id)).value;

const user = useCurrentUser();

function authorSubmit() {
    console.log(inputValue("surname"));

    addDoc(authorsRef, {
        // TODO: maybe don't assume not null
        uploader: user.value!.uid,
        given_name: inputValue("given_name"),
        surname: inputValue("surname"),
    });
}
</script>

<template>
    <h1>Add Author</h1>
    <form @submit.prevent="authorSubmit">
        <label for="surname">Surname</label>
        <input type="text" name="surname" id="surname" />

        <label for="given_name">Given Name</label>
        <input type="text" name="given_name" id="given_name" />

        <button type="submit">Add</button>
    </form>
</template>
