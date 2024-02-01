<script setup lang="ts">
import AddBook from "@/components/AddBook.vue";
import AddAuthor from "../components/AddAuthor.vue";
import AddEdition from "@/components/AddEdition.vue";
import AddPublisher from "@/components/AddPublisher.vue";
</script>

<template>
    <h1>Upload</h1>
    <!-- TODO: make it so Editions, Books and Authors are here and they can be minimised -->
    <AddAuthor />
    <AddPublisher />
    <AddBook />
    <AddEdition />
</template>
