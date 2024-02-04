<script setup lang="ts">
import { useCurrentUser } from "vuefire";

defineProps<{ name: string }>();
const emit = defineEmits<{ submit: [event: Event, uploader: string] }>();

const user = useCurrentUser();

// TODO: ensure not null
const onSubmit = (event: Event) => emit("submit", event, user.value!.uid);
</script>

<template>
    <div class="add-form">
        <h2>Upload {{ name }}</h2>
        <form @submit.prevent="onSubmit">
            <slot></slot>
            <button>Upload {{ name }}</button>
        </form>
    </div>
</template>

<style scoped>
.add-form {
    margin: 2em;
    flex-grow: 1;
}
</style>
