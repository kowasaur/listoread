<script lang="ts">
function title(date: Datey) {
    if (typeof date === "number") return;
    return date?.toDate().toLocaleString("en-au", { minute: "2-digit", hour: "numeric" });
}
</script>

<script setup lang="ts">
import type { Datey } from "@/firebase";

defineProps<{ date: Datey }>();
</script>

<template>
    <span :title="title(date)">
        {{ typeof date === "number" ? date : date?.toDate().toLocaleDateString("en-au") }}
    </span>
</template>
