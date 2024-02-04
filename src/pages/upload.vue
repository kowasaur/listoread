<script setup lang="ts">
import AddBook from "@/components/upload/AddBook.vue";
import AddAuthor from "../components/upload/AddAuthor.vue";
import AddEdition from "@/components/upload/AddEdition.vue";
import AddPublisher from "@/components/upload/AddPublisher.vue";
</script>

<template>
    <!-- TODO: make it so each "tab" can be minimised -->
    <div class="uploads">
        <AddAuthor />
        <AddPublisher />
        <AddBook />
        <AddEdition />
    </div>
</template>

<style scoped>
.uploads {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
}
</style>
