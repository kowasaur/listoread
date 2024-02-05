<script setup lang="ts">
import { useCurrentUser } from "vuefire";

defineProps<{ title: string; class?: string }>();
const emit = defineEmits<{ submit: [event: Event, uploader: string] }>();

const user = useCurrentUser();

// TODO: ensure not null
const onSubmit = (event: Event) => emit("submit", event, user.value!.uid);
</script>

<template>
    <div :class="class">
        <h2>{{ title }}</h2>
        <form @submit.prevent="onSubmit">
            <slot></slot>
            <button>{{ title }}</button>
        </form>
    </div>
</template>

<style scoped>
button {
    margin-top: 0.3rem;
}
</style>
