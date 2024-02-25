<script setup lang="ts">
import { onMounted, ref } from "vue";
import ColorThief from "colorthief";
import type { Edition } from "@/firebase";
import { capLength } from "@/utils";

defineProps<{ months: Set<number>; edition: Edition }>();

const randColour = () => `hsl(${Math.floor(Math.random() * 256)}, 70%, 70%)`;
const colorThief = new ColorThief();

const img = ref<HTMLImageElement | null>(null);

onMounted(() => {
    if (!img.value) return;
    img.value.crossOrigin = "Anonymous";
    if (img.value.complete) {
        console.log(colorThief.getColor(img.value));
    } else {
        img.value.addEventListener("load", () => console.log(colorThief.getColor(img.value)));
    }
});
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
