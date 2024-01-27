<script setup lang="ts">
import { signInWithPopup, signOut } from "firebase/auth";
import { useFirestore, useFirebaseAuth, useCurrentUser } from "vuefire";
import { googleAuthProvider } from "./firebase";

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
</script>

<template>
    <div v-if="user">
        <h1>Hello {{ user.displayName }}</h1>
        <div>{{ user.uid }}</div>
        <img :src="user.photoURL!" />
        <button @click="signOut(auth)">Sign Out</button>
    </div>
    <button v-else @click="signInWithPopup(auth, googleAuthProvider)">Sign In With Google</button>
</template>
