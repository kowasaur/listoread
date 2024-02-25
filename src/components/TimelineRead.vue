<script lang="ts">
let colour = -21;
</script>

<script setup lang="ts">
import type { Edition } from "@/firebase";
import { capLength } from "@/utils";

defineProps<{ months: Set<number>; edition: Edition }>();

function randColour() {
    colour += 21;
    return `hsl(${colour}, 70%, 70%)`;
}
</script>

<template>
    <div
        class="read"
        :style="{
            gridColumnStart: Math.min(...months) + 1,
            gridColumnEnd: Math.max(...months) + 2,
            backgroundColor: randColour(),
        }"
    >
        <img
            v-if="edition.img_url"
            :src="edition.img_url"
            alt="Cover of edition"
            width="40"
            ref="img"
        />
        <div class="title">{{ capLength(edition.title, 25) }}</div>
    </div>
</template>

<style scoped>
.read {
    display: flex;
    align-items: center;
}

.title {
    font-size: small;
}
</style>
