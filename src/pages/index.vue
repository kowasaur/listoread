<script setup lang="ts">
import { signInWithPopup, signOut } from "firebase/auth";
import { useFirebaseAuth, useCurrentUser } from "vuefire";
import { googleAuthProvider } from "../firebase";
import AddAuthor from "../components/AddAuthor.vue";

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
</script>

<template>
    <div v-if="user">
        <h1>Hello {{ user.displayName }}</h1>
        <div>{{ user.uid }}</div>
        <img :src="user.photoURL!" />
        <button @click="signOut(auth)">Sign Out</button>

        <AddAuthor />
    </div>
    <button v-else @click="signInWithPopup(auth, googleAuthProvider)">Sign In With Google</button>
</template>
