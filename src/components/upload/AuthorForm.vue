<script setup lang="ts">
import type { Author } from "@/firebase";
import { getInputById, inputValue } from "@/utils";
import TextInput from "@/components/input/TextInput.vue";
import UserForm from "../UserForm.vue";
import Checkbox from "@/components/input/Checkbox.vue";

defineProps<{ heading: string } & Partial<Omit<Author, "uploader" | "id">>>();
const emit = defineEmits<{ submit: [data: Omit<Author, "id">] }>();

function handleSubmit({ target }: Event, uploader: string) {
    const data: Omit<Author, "id"> = {
        uploader,
        given_name: inputValue("given_name"),
        surname: inputValue("surname"),
        surname_first: getInputById("surname_first").checked,
    };

    emit("submit", data);
    (<HTMLFormElement>target).reset();
}
</script>

<template>
    <UserForm :title="heading" @submit="handleSubmit">
        <TextInput field="given_name" label="Given Name" />
        <TextInput field="surname" label="Surname" required />
        <Checkbox field="surname_first" label="Surname should display first" />
    </UserForm>
</template>
