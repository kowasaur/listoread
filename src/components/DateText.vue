<script setup lang="ts">
import type { Timestamp } from "firebase/firestore";

defineProps<{ date: Timestamp | null }>();
</script>

<template>
    <span :title="date?.toDate().toLocaleString('en-au', { minute: '2-digit', hour: 'numeric' })">
        {{ date?.toDate().toLocaleDateString("en-au") }}
    </span>
</template>
