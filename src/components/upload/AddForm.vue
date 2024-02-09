<script setup lang="ts">
import UserForm from "@/components/UserForm.vue";
defineProps<{ name: string }>();
defineEmits<{ submit: [event: Event, uploader: string] }>();
</script>

<template>
    <UserForm :title="`Upload ${name}`" @submit="(e, u) => $emit('submit', e, u)" class="add-form">
        <slot></slot>
    </UserForm>
</template>

<style>
.add-form {
    margin: 2em;
    flex-grow: 1;
    min-width: 16rem;
}
</style>
