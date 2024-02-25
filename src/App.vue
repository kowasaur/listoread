<script setup lang="ts">
import { useIsCurrentUserLoaded, useFirebaseAuth, useCurrentUser } from "vuefire";
import { signInWithPopup, signOut } from "firebase/auth";
import { ModalsContainer } from "vue-final-modal";
import { googleAuthProvider } from "./firebase";

const auth = useFirebaseAuth()!;
const user = useCurrentUser();
</script>

<template>
    <template v-if="useIsCurrentUserLoaded().value">
        <header>
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/stats">Stats</RouterLink>
                <RouterLink to="/upload">Upload</RouterLink>
                <RouterLink to="/edition/all">Editions</RouterLink>
                <RouterLink to="/backup">Backup</RouterLink>
                <button v-if="user" @click="signOut(auth)">Sign Out</button>
                <button v-else @click="signInWithPopup(auth, googleAuthProvider)">
                    Sign In With Google
                </button>
            </nav>
        </header>
        <RouterView />
    </template>
    <h2 v-else>Loading...</h2>
    <ModalsContainer />
</template>

<style scoped>
nav {
    display: flex;
    justify-content: space-between;
    background-color: lightgreen;
    padding: 1em;
}
</style>
