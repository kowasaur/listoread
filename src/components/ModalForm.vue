<script setup lang="ts">
import { VueFinalModal } from "vue-final-modal";
import UserForm from "@/components/UserForm.vue";

defineProps<{ title: string }>();
const emit = defineEmits<{ submit: [uploader: string] }>();
</script>

<template>
    <VueFinalModal class="container" content-class="modal">
        <UserForm :title="title" @submit="(_, u) => $emit('submit', u)">
            <slot></slot>
        </UserForm>
    </VueFinalModal>
</template>

<style>
.modal {
    background-color: aliceblue;
    padding: 3em;
    border-radius: 0.35rem;
    box-shadow: 0 0 1em;
}
</style>
