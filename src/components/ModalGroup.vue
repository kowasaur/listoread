<script setup lang="ts">
import { inputValue } from "@/utils";
import { type FormListGroup } from "@/firebase";
import ModalForm from "./ModalForm.vue";
import TextInput from "@/components/input/TextInput.vue";

defineProps<{ title: string; name?: string; colour?: string }>();
const emit = defineEmits<{ submit: [data: FormListGroup] }>();

function handleSubmit(uploader: string) {
    emit("submit", {
        uploader,
        name: inputValue("group-name"),
        colour: inputValue("group-colour"),
    });
}
</script>

<template>
    <ModalForm :title="title" @submit="handleSubmit">
        <TextInput field="group-name" label="Name" required :initial-value="name" />
        <div class="form-input">
            <label for="group-colour">Colour</label>
            <input type="color" name="group-colour" id="group-colour" :value="colour" />
        </div>
    </ModalForm>
</template>
