<script setup lang="ts">
import { useIsCurrentUserLoaded } from "vuefire";
</script>

<template>
    <template v-if="useIsCurrentUserLoaded().value">
        <header>
            <nav>
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/upload">Upload</RouterLink>
            </nav>
        </header>
        <RouterView />
    </template>
    <h2 v-else>Loading...</h2>
</template>
