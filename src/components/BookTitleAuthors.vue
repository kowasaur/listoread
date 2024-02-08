<!-- Shows the title and authors of a book -->
<script setup lang="ts">
import type { Author } from "@/firebase";
import { fullName } from "@/utils";

defineProps<{
    title: string;
    authors: Author[];
    showEdit?: boolean;
}>();

defineEmits<{ editClick: [] }>();
</script>

<template>
    <h2 class="space-between">
        <div>{{ title }}</div>
        <button v-if="showEdit" @click="$emit('editClick')">Edit</button>
    </h2>
    <slot></slot>
    <h3>
        By
        <template v-for="(a, i) in authors" :to="`authors/${a.id}`">
            <RouterLink :to="`/author/${a.id}`">{{ fullName(a) }}</RouterLink>
            <template v-if="i === authors.length - 2"> and </template>
            <template v-else-if="i < authors.length - 1">, </template>
        </template>
    </h3>
</template>
